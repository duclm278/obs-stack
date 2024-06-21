package trace

import (
	"errors"

	"github.com/gin-gonic/gin"
)

const traceIDKey = "middleware.trace.traceID"

func SetContextTraceID(c *gin.Context, traceID string) {
	c.Set(traceIDKey, traceID)
}

func GetContextTraceID(c *gin.Context) (string, error) {
	traceID, ok := c.Get(traceIDKey)
	if !ok {
		return "", errors.New("traceID not found")
	}
	return traceID.(string), nil
}
