// https://github.com/uptrace/bunrouter/blob/master/example/rate-limiting/main.go#L44
package ratelimit

import (
	"context"
	"fmt"
	"main/middleware/ginout"
	"main/middleware/log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis_rate/v10"
	"github.com/redis/go-redis/v9"
)

type Config struct {
	Client  redis.UniversalClient
	Limit   redis_rate.Limit
	WithKey func(c *gin.Context) (string, error)

	// Used as prefix to avoid key collisions if same key used by multiple limits
	RatePolicy string
	// Used as prefix to avoid key collisions if same key used by multiple limits
	RateUnit string

	Enable bool
}

func New(cfg Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		logger, err := log.GetContextLogger(c)
		if err != nil {
			msg := "error getting context for rate limit"
			logger.Error(msg, "error", err)
			ginout.Error(c, http.StatusInternalServerError, msg)
			return
		}

		key, err := cfg.WithKey(c)
		if err != nil {
			msg := "error getting key for rate limit"
			logger.Error(msg, "error", err)
			ginout.Error(c, http.StatusInternalServerError, msg)
			return
		}

		if !cfg.Enable {
			logger.Info("skipped checking rate limit")
			c.Next()
			return
		}

		rrl := redis_rate.NewLimiter(cfg.Client)
		key = fmt.Sprintf("%s:%d:%s:%s", cfg.RatePolicy, cfg.Limit.Rate, cfg.RateUnit, key)
		res, err := rrl.Allow(context.Background(), key, cfg.Limit)
		if err != nil {
			logger.Warn("skipped checking rate limit", "error", err)
			c.Next()
			return
		}

		c.Header("RateLimit-Remaining", strconv.Itoa(res.Remaining))
		if res.Allowed == 0 {
			logger.Error("rate limit exceeded", "rate", cfg.Limit.Rate, "unit", cfg.RateUnit, "burst", cfg.Limit.Burst, "policy", cfg.RatePolicy, "key", key)
			seconds := int(res.RetryAfter / time.Second)
			c.Header("Retry-After", strconv.Itoa(seconds))
			msg := fmt.Sprintf("rate limit exceeded %d %s (burst %d) set by policy %s", cfg.Limit.Rate, cfg.RateUnit, cfg.Limit.Burst, cfg.RatePolicy)
			ginout.Error(c, http.StatusTooManyRequests, msg)
			return
		}

		c.Next()
	}
}
