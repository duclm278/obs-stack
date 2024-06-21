package trace

import (
	"log/slog"
	"main/middleware/log"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func New() gin.HandlerFunc {
	return func(c *gin.Context) {
		logger, err := log.GetContextLogger(c)
		if err != nil {
			logger = slog.Default()
			logger.Warn("middleware log should be used before getting logger, falling back to default", "error", err)
		}

		// Generate traceID and save it to Gin's context
		traceID := uuid.New()
		SetContextTraceID(c, traceID.String())

		// Update logger
		log.SetContextLogger(c, logger.With("traceID", traceID))

		c.Next()
	}
}
