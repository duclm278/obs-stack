package ip

import (
	"errors"

	"github.com/gin-gonic/gin"
)

const (
	remoteIPKey     = "middleware.ip.remoteIP"
	realClientIPKey = "middleware.ip.realClientIP"
)

func SetContextRemoteIP(c *gin.Context, remoteIP string) {
	c.Set(remoteIPKey, remoteIP)
}

func GetContextRemoteIP(c *gin.Context) (string, error) {
	remoteIP, ok := c.Get(remoteIPKey)
	if !ok {
		return c.RemoteIP(), errors.New("remoteIP not found")
	}
	return remoteIP.(string), nil
}

func SetContextRealClientIP(c *gin.Context, realClientIP string) {
	c.Set(realClientIPKey, realClientIP)
}

func GetContextRealClientIP(c *gin.Context) (string, error) {
	realClientIP, ok := c.Get(realClientIPKey)
	if !ok {
		return c.ClientIP(), errors.New("realClientIP not found")
	}
	return realClientIP.(string), nil
}
