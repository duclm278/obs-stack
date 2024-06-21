// https://github.com/go-chi/httprate/blob/master/httprate.go
package ip

import (
	"net"

	"github.com/gin-gonic/gin"
	"github.com/realclientip/realclientip-go"
)

func KeyByIP(c *gin.Context) (string, error) {
	r := c.Request
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		ip = r.RemoteAddr
	}
	return canonicalizeIP(ip), nil
}

// https://github.com/go-chi/chi/issues/711
// https://github.com/realclientip/realclientip-go
func KeyByLeftmostNonPrivateIP(headerName string) func(c *gin.Context) (string, error) {
	return func(c *gin.Context) (string, error) {
		r := c.Request
		s, err := realclientip.NewLeftmostNonPrivateStrategy(headerName)
		if err != nil {
			return "", err
		}
		ip := s.ClientIP(r.Header, r.RemoteAddr)
		return canonicalizeIP(ip), nil
	}
}

// https://github.com/go-chi/chi/issues/711
// https://github.com/realclientip/realclientip-go
func KeyByRightmostNonPrivateIP(headerName string) func(c *gin.Context) (string, error) {
	return func(c *gin.Context) (string, error) {
		r := c.Request
		s, err := realclientip.NewRightmostNonPrivateStrategy(headerName)
		if err != nil {
			return "", err
		}
		ip := s.ClientIP(r.Header, r.RemoteAddr)
		return canonicalizeIP(ip), nil
	}
}

// https://github.com/go-chi/chi/issues/711
// https://github.com/realclientip/realclientip-go
func KeyByRightmostTrustedCountIP(headerName string, trustedCount int) func(c *gin.Context) (string, error) {
	return func(c *gin.Context) (string, error) {
		r := c.Request
		s, err := realclientip.NewRightmostTrustedCountStrategy(headerName, trustedCount)
		if err != nil {
			return "", err
		}
		ip := s.ClientIP(r.Header, r.RemoteAddr)
		return canonicalizeIP(ip), nil
	}
}

func KeyByEndpoint(c *gin.Context) (string, error) {
	r := c.Request
	return r.URL.Path, nil
}

// canonicalizeIP returns a form of ip suitable for comparison to other IPs.
// For IPv4 addresses, this is simply the whole string.
// For IPv6 addresses, this is the /64 prefix.
func canonicalizeIP(ip string) string {
	isIPv6 := false
	// This is how net.ParseIP decides if an address is IPv6
	// https://cs.opensource.google/go/go/+/refs/tags/go1.17.7:src/net/ip.go;l=704
	for loop, i := true, 0; loop && !isIPv6 && i < len(ip); i++ {
		switch ip[i] {
		case '.':
			// IPv4
			return ip
		case ':':
			// IPv6
			isIPv6 = true
			loop = false
		}
	}
	if !isIPv6 {
		// Not an IP address at all
		return ip
	}

	ipv6 := net.ParseIP(ip)
	if ipv6 == nil {
		return ip
	}

	return ipv6.Mask(net.CIDRMask(64, 128)).String()
}
