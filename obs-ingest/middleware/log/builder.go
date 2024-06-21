package log

import (
	"log/slog"

	"github.com/gin-gonic/gin"
)

func New(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		SetContextLogger(c, logger)
		c.Next()
	}
}
