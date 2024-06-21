package auth

import (
	"errors"

	"github.com/gin-gonic/gin"
)

const (
	tenantIDKey      = "middleware.auth.tenantID"
	isMultiTenantKey = "middleware.auth.isMultiTenant"
)

func SetContextTenantID(c *gin.Context, tenantID string) {
	c.Set(tenantIDKey, tenantID)
}

func GetContextTenantID(c *gin.Context) (string, error) {
	tenantID, ok := c.Get(tenantIDKey)
	if !ok {
		return "", errors.New("tenantID not found")
	}
	return tenantID.(string), nil
}

func SetContextIsMultiTenant(c *gin.Context, isMultiTenant bool) {
	c.Set(isMultiTenantKey, isMultiTenant)
}

func GetContextIsMultiTenant(c *gin.Context) (bool, error) {
	isMultiTenant, ok := c.Get(isMultiTenantKey)
	if !ok {
		return false, errors.New("isMultiTenant not found")
	}
	return isMultiTenant.(bool), nil
}
