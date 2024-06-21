// https://github.com/uptrace/bunrouter/blob/master/example/rate-limiting/main.go#L44
package ip

import (
	"main/middleware/ginout"
	"main/middleware/log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Config struct {
	WithRealClientIP func(c *gin.Context) (string, error)
}

func New(cfg Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		logger, err := log.GetContextLogger(c)
		if err != nil {
			msg := "error getting real client IP"
			logger.Error(msg, "error", err)
			ginout.Error(c, http.StatusInternalServerError, msg)
			return
		}

		// Get real client IP and save it to Gin's context
		clientIP, err := cfg.WithRealClientIP(c)
		if err != nil {
			msg := "error getting real client IP"
			logger.Error(msg, "error", err)
			ginout.Error(c, http.StatusInternalServerError, msg)
			return
		}
		SetContextRemoteIP(c, c.RemoteIP())
		SetContextRealClientIP(c, clientIP)

		// Update logger
		log.SetContextLogger(c, logger.With("remoteIP", c.RemoteIP()).With("clientIP", clientIP))

		c.Next()
	}
}
