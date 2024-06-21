package config

import (
	"github.com/caarlos0/env/v11"
)

var appConfig AppConfig

type AppConfig struct {
	// Redis
	RedisNodes      []string `env:"REDIS_NODES" envDefault:"localhost:6379"`
	RedisMasterName string   `env:"REDIS_MASTER_NAME" envDefault:""`
	RedisPassword   string   `env:"REDIS_PASSWORD,unset" envDefault:""`

	// Real IP
	RightmostTrustedHeader string `env:"RIGHTMOST_TRUSTED_HEADER" envDefault:"X-Forwarded-For"`
	RightmostTrustedCount  int    `env:"RIGHTMOST_TRUSTED_COUNT" envDefault:"0"`

	// Core
	CoreBackendHost               string `env:"CORE_BACKEND_HOST" envDefault:"localhost:8080"`
	CoreBackendScheme             string `env:"CORE_BACKEND_SCHEME" envDefault:"http"`
	CoreBackendInsecureSkipVerify bool   `env:"CORE_BACKEND_INSECURE_SKIP_VERIFY" envDefault:"true"`

	// Log
	LogIngestHost                  string `env:"LOG_INGEST_HOST" envDefault:"localhost:3100"`
	LogRequestsPerMinutePerIP      int    `env:"LOG_REQUESTS_PER_MINUTE_PER_IP" envDefault:"10"`
	LogRequestsPerHourPerIP        int    `env:"LOG_REQUESTS_PER_HOUR_PER_IP" envDefault:"500"`
	LogRequestsPerMinutePerProject int    `env:"LOG_REQUESTS_PER_MINUTE_PER_PROJECT" envDefault:"10"`
	LogRequestsPerHourPerProject   int    `env:"LOG_REQUESTS_PER_HOUR_PER_PROJECT" envDefault:"500"`
	LogEnableRateLimit             bool   `env:"LOG_ENABLE_RATE_LIMIT" envDefault:"true"`

	// Trace
	TraceIngestHost                  string `env:"TRACE_INGEST_HOST" envDefault:"localhost:3200"`
	TraceRequestsPerMinutePerIP      int    `env:"TRACE_REQUESTS_PER_MINUTE_PER_IP" envDefault:"10"`
	TraceRequestsPerHourPerIP        int    `env:"TRACE_REQUESTS_PER_HOUR_PER_IP" envDefault:"500"`
	TraceRequestsPerMinutePerProject int    `env:"TRACE_REQUESTS_PER_MINUTE_PER_PROJECT" envDefault:"10"`
	TraceRequestsPerHourPerProject   int    `env:"TRACE_REQUESTS_PER_HOUR_PER_PROJECT" envDefault:"500"`
	TraceEnableRateLimit             bool   `env:"TRACE_ENABLE_RATE_LIMIT" envDefault:"true"`

	// Metric
	MetricIngestHost                  string `env:"METRIC_INGEST_HOST" envDefault:"localhost:9009"`
	MetricRequestsPerMinutePerIP      int    `env:"METRIC_REQUESTS_PER_MINUTE_PER_IP" envDefault:"10"`
	MetricRequestsPerHourPerIP        int    `env:"METRIC_REQUESTS_PER_HOUR_PER_IP" envDefault:"500"`
	MetricRequestsPerMinutePerProject int    `env:"METRIC_REQUESTS_PER_MINUTE_PER_PROJECT" envDefault:"10"`
	MetricRequestsPerHourPerProject   int    `env:"METRIC_REQUESTS_PER_HOUR_PER_PROJECT" envDefault:"500"`
	MetricEnableRateLimit             bool   `env:"METRIC_ENABLE_RATE_LIMIT" envDefault:"true"`
}

func GetAppConfig() *AppConfig {
	return &appConfig
}

func LoadAppConfig() {
	if err := env.Parse(&appConfig); err != nil {
		panic(err)
	}
}
