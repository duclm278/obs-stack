package log

import (
	"errors"
	"log/slog"

	"github.com/gin-gonic/gin"
)

const loggerKey = "middleware.log.logger"

func SetContextLogger(c *gin.Context, logger *slog.Logger) {
	c.Set(loggerKey, logger)
}

func GetContextLogger(c *gin.Context) (*slog.Logger, error) {
	logger, ok := c.Get(loggerKey)
	if !ok {
		return slog.Default(), errors.New("logger not found")
	}
	return logger.(*slog.Logger), nil
}
