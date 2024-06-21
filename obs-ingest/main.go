package main

import (
	"context"
	"crypto/tls"
	"log/slog"
	"main/config"
	"main/middleware/auth"
	"main/middleware/ip"
	"main/middleware/log"
	"main/middleware/ratelimit"
	"main/middleware/trace"
	"main/route/logs"
	"main/route/metrics"
	"main/route/traces"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis_rate/v10"
	"github.com/go-resty/resty/v2"
	"github.com/redis/go-redis/v9"
)

func main() {
	// App config
	config.LoadAppConfig()
	app := config.GetAppConfig()

	// Log config
	level := slog.LevelInfo
	if gin.IsDebugging() {
		level = slog.LevelDebug
	}
	replace := func(_ []string, a slog.Attr) slog.Attr {
		if a.Key == slog.SourceKey {
			source := a.Value.Any().(*slog.Source)
			fullDir, file := filepath.Split(source.File)
			lastDir := filepath.Base(filepath.Dir(fullDir))
			source.File = filepath.Join(lastDir, file)
		}
		return a
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		AddSource:   true,
		Level:       level,
		ReplaceAttr: replace,
	}))

	// Redis instance
	// 1. If the MasterName option is specified, a sentinel-backed FailoverClient is returned.
	// 2. If the number of Addrs is two or more, a ClusterClient is returned.
	// 3. Otherwise, a single-node Client is returned.
	rdb := redis.NewUniversalClient(&redis.UniversalOptions{
		Addrs:      app.RedisNodes,
		MasterName: app.RedisMasterName,
		Password:   app.RedisPassword,
	})
	_ = rdb.FlushDB(context.Background()).Err()

	// Lazy RESTful
	proxyClient := resty.New().
		SetBaseURL(app.CoreBackendScheme+"://"+app.CoreBackendHost).
		SetTLSClientConfig(&tls.Config{InsecureSkipVerify: app.CoreBackendInsecureSkipVerify}).
		SetHeader("Accept", "application/json")

	// Gin engine
	e := gin.Default()

	// Save essentials to Gin's context
	e.Use(log.New(logger)) // App's logger
	e.Use(trace.New())     // App's tracer

	// Get real client IP and save it to Gin's context
	e.SetTrustedProxies(nil)
	if app.RightmostTrustedHeader == "" || app.RightmostTrustedCount == 0 {
		e.Use(ip.New(ip.Config{
			WithRealClientIP: ip.KeyByIP,
		}))
	} else {
		// Get real client IP and save it to Gin's context
		e.Use(ip.New(ip.Config{
			WithRealClientIP: ip.KeyByRightmostTrustedCountIP(app.RightmostTrustedHeader, app.RightmostTrustedCount),
		}))
	}

	logGroup := e.Group("/logs")
	logGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerMinute(app.LogRequestsPerMinutePerIP),
		WithKey:    ip.GetContextRealClientIP,
		RatePolicy: "logs",     // Used as prefix to avoid key collisions
		RateUnit:   "req/m/ip", // Used as prefix to avoid key collisions
		Enable:     app.LogEnableRateLimit,
	}))
	logGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerHour(app.LogRequestsPerHourPerIP),
		WithKey:    ip.GetContextRealClientIP,
		RatePolicy: "logs",     // Used as prefix to avoid key collisions
		RateUnit:   "req/h/ip", // Used as prefix to avoid key collisions
		Enable:     app.LogEnableRateLimit,
	}))
	logGroup.Use(auth.New(auth.Config{RESTClient: proxyClient}))
	logGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerMinute(app.LogRequestsPerMinutePerProject),
		WithKey:    auth.GetContextTenantID,
		RatePolicy: "logs",          // Used as prefix to avoid key collisions
		RateUnit:   "req/m/project", // Used as prefix to avoid key collisions
		Enable:     app.LogEnableRateLimit,
	}))
	logGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerHour(app.LogRequestsPerHourPerProject),
		WithKey:    auth.GetContextTenantID,
		RatePolicy: "logs",          // Used as prefix to avoid key collisions
		RateUnit:   "req/h/project", // Used as prefix to avoid key collisions
		Enable:     app.LogEnableRateLimit,
	}))
	logGroup.POST("", logs.DefaultHandler)

	traceGroup := e.Group("/traces")
	traceGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerMinute(app.TraceRequestsPerMinutePerIP),
		WithKey:    ip.GetContextRealClientIP,
		RatePolicy: "traces",   // Used as prefix to avoid key collisions
		RateUnit:   "req/m/ip", // Used as prefix to avoid key collisions
		Enable:     app.TraceEnableRateLimit,
	}))
	traceGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerHour(app.TraceRequestsPerHourPerIP),
		WithKey:    ip.GetContextRealClientIP,
		RatePolicy: "traces",   // Used as prefix to avoid key collisions
		RateUnit:   "req/h/ip", // Used as prefix to avoid key collisions
		Enable:     app.TraceEnableRateLimit,
	}))
	traceGroup.Use(auth.New(auth.Config{RESTClient: proxyClient}))
	traceGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerMinute(app.TraceRequestsPerMinutePerProject),
		WithKey:    auth.GetContextTenantID,
		RatePolicy: "traces",        // Used as prefix to avoid key collisions
		RateUnit:   "req/m/project", // Used as prefix to avoid key collisions
		Enable:     app.TraceEnableRateLimit,
	}))
	traceGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerHour(app.TraceRequestsPerHourPerProject),
		WithKey:    auth.GetContextTenantID,
		RatePolicy: "traces",        // Used as prefix to avoid key collisions
		RateUnit:   "req/h/project", // Used as prefix to avoid key collisions
		Enable:     app.TraceEnableRateLimit,
	}))
	traceGroup.POST("", traces.DefaultHandler)

	// Routes
	metricGroup := e.Group("/metrics")
	metricGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerMinute(app.MetricRequestsPerMinutePerIP),
		WithKey:    ip.GetContextRealClientIP,
		RatePolicy: "metrics",  // Used as prefix to avoid key collisions
		RateUnit:   "req/m/ip", // Used as prefix to avoid key collisions
		Enable:     app.MetricEnableRateLimit,
	}))
	metricGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerHour(app.MetricRequestsPerHourPerIP),
		WithKey:    ip.GetContextRealClientIP,
		RatePolicy: "metrics",  // Used as prefix to avoid key collisions
		RateUnit:   "req/h/ip", // Used as prefix to avoid key collisions
		Enable:     app.MetricEnableRateLimit,
	}))
	metricGroup.Use(auth.New(auth.Config{RESTClient: proxyClient}))
	metricGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerMinute(app.MetricRequestsPerMinutePerProject),
		WithKey:    auth.GetContextTenantID,
		RatePolicy: "metrics",       // Used as prefix to avoid key collisions
		RateUnit:   "req/m/project", // Used as prefix to avoid key collisions
		Enable:     app.MetricEnableRateLimit,
	}))
	metricGroup.Use(ratelimit.New(ratelimit.Config{
		Client:     rdb,
		Limit:      redis_rate.PerHour(app.MetricRequestsPerHourPerProject),
		WithKey:    auth.GetContextTenantID,
		RatePolicy: "metrics",       // Used as prefix to avoid key collisions
		RateUnit:   "req/h/project", // Used as prefix to avoid key collisions
		Enable:     app.MetricEnableRateLimit,
	}))
	metricGroup.POST("", metrics.DefaultHandler)

	// Start server
	e.Run(":8181")
}
