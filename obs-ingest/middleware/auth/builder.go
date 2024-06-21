package auth

import (
	"main/middleware/ginout"
	"main/middleware/log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

type Config struct {
	RESTClient *resty.Client
}

type Token struct {
	ID            string `json:"id"`
	IsEnabled     bool   `json:"enabled"`
	IsMultiTenant bool   `json:"multiTenant"`
	Project       *struct {
		ID *string `json:"id"`
	} `json:"project"`
}

func New(cfg Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		logger, err := log.GetContextLogger(c)
		if err != nil {
			msg := "error getting context for authentication"
			logger.Error(msg, "error", err)
			ginout.Error(c, http.StatusInternalServerError, msg)
			return
		}

		// Get key from header
		k := "Authorization"
		v := c.Request.Header.Get(k)
		if v == "" {
			msg := "missing auth header"
			logger.Error(msg)
			ginout.Error(c, http.StatusUnauthorized, msg)
			return
		}
		parts := strings.Fields(v)
		if len(parts) != 2 || parts[0] != "Token" {
			msg := "invalid auth header"
			logger.Error(msg)
			ginout.Error(c, http.StatusUnauthorized, msg)
			return
		}

		// Send auth request
		var token Token
		resp, err := cfg.RESTClient.R().
			SetHeader(k, v).
			SetResult(&token).
			Get("api/v1/api-tokens/me")
		if err != nil {
			msg := "failed to send auth request"
			logger.Error(msg, "error", err)
			ginout.Error(c, http.StatusInternalServerError, msg)
			return
		}
		if resp.StatusCode() != http.StatusOK {
			msg := "failed to authenticate"
			logger.Error(msg)
			ginout.Error(c, resp.StatusCode(), msg)
			return
		}

		// Check if enabled
		if !token.IsEnabled {
			msg := "token is disabled"
			logger.Error(msg)
			ginout.Error(c, http.StatusUnauthorized, msg)
			return
		}

		// Save tenant info to gin context
		if token.Project == nil {
			msg := "no projects associated with this token"
			logger.Error(msg)
			ginout.Error(c, http.StatusUnauthorized, msg)
		}
		if token.Project.ID == nil {
			msg := "project missing info needed for authentication"
			logger.Error(msg)
			ginout.Error(c, http.StatusUnauthorized, msg)
		}
		tenantID := *token.Project.ID
		isMultiTenant := token.IsMultiTenant
		SetContextTenantID(c, tenantID)
		SetContextIsMultiTenant(c, token.IsMultiTenant)
		log.SetContextLogger(c, logger.With("tenantID", tenantID).With("isMultiTenant", isMultiTenant))
		c.Next()
	}
}
