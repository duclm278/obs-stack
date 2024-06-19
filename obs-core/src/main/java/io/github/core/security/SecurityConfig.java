package io.github.core.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

@Configuration
public class SecurityConfig {
    @Bean
    AuthenticationEntryPoint authenticationEntryPoint() {
        return new SecurityEntryPoint();
    }

    @Bean
    AccessDeniedHandler accessDeniedHandler() {
        return new SecurityHandler();
    }
}
