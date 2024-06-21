package ginout

import (
	"log/slog"
	"main/middleware/log"
	"main/middleware/trace"

	"github.com/gin-gonic/gin"
)

func Error(c *gin.Context, statusCode int, message string) {
	logger, err := log.GetContextLogger(c)
	if err != nil {
		logger = slog.Default()
		logger.Warn("middleware log should be used before getting logger, falling back to default", "error", err)
	}

	traceID, err := trace.GetContextTraceID(c)
	if err != nil {
		traceID = ""
		logger.Warn("middleware trace should be used before getting traceID, falling back to default", "error", err)
	}

	c.AbortWithStatusJSON(statusCode, gin.H{"traceID": traceID, "message": message})
}
