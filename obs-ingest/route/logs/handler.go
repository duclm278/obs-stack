package logs

import (
	"bytes"
	"fmt"
	"io"
	"main/config"
	"main/middleware/auth"
	"main/middleware/ginout"
	"main/middleware/log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DefaultHandler(c *gin.Context) {
	app := config.GetAppConfig()
	logger, err := log.GetContextLogger(c)
	if err != nil {
		msg := "error getting logger"
		logger.Error(msg, "error", err)
		ginout.Error(c, http.StatusInternalServerError, msg)
		return
	}

	// Get original request
	req := c.Request

	// Get tenant info from token
	tenantID, err := auth.GetContextTenantID(c)
	if err != nil {
		msg := "failed to get tenant info"
		logger.Error(msg, "error", err)
		ginout.Error(c, http.StatusInternalServerError, msg)
		return
	}

	// Clone request body
	compressed := []byte{}
	if req.Body != nil {
		compressed, _ = io.ReadAll(req.Body) // Read
	}
	req.Body = io.NopCloser(bytes.NewBuffer(compressed)) // Reset

	// Modify request if needed
	// ...

	// Create new HTTP request with same method and body as original request
	newTarget := fmt.Sprintf("http://%s/api/v1/push", app.MetricIngestHost)
	proxyReq, err := http.NewRequest(req.Method, newTarget, req.Body)
	if err != nil {
		msg := "failed to create database request"
		logger.Error(msg, "error", err)
		ginout.Error(c, http.StatusInternalServerError, msg)
		return
	}

	// Copy headers from original request to proxy request
	proxyReq.Header = req.Header.Clone()

	// Drop Authorization header
	proxyReq.Header.Del("Authorization")

	// Add tenant info to header
	proxyReq.Header.Add("X-Scope-OrgID", tenantID)

	// Send proxy request using default client
	resp, err := http.DefaultClient.Do(proxyReq)
	if err != nil {
		msg := "failed to send request to database"
		logger.Error(msg, "error", err)
		ginout.Error(c, http.StatusInternalServerError, msg)
		return
	}
	defer resp.Body.Close()

	// Copy headers from proxy response to original response
	for name, values := range resp.Header {
		for _, value := range values {
			c.Writer.Header().Add(name, value)
		}
	}

	// Set status code of original response to status code of proxy response
	c.Writer.WriteHeader(resp.StatusCode)

	// Copy body of proxy response to original response
	io.Copy(c.Writer, resp.Body)
}
