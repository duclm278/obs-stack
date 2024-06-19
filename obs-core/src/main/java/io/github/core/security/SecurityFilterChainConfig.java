package io.github.core.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static io.github.core.scope.Role.*;
import static io.github.core.scope.RoleScope.USER_READ;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityFilterChainConfig {
    private final JwtRequestFilter jwtRequestFilter;
    private final ApiTokenRequestFilter apiTokenRequestFilter;
    private final ProjectRequestFilter projectRequestFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(sessionManagement ->
                        sessionManagement
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(apiTokenRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(projectRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorizeHttpRequests ->
                        authorizeHttpRequests
                                .requestMatchers("/error").permitAll()
                                .requestMatchers("/api/v1/auth/**").permitAll()
                                .requestMatchers("/api/v1/admin/**").hasRole(
                                        ADMIN.name()
                                )
                                .requestMatchers("/api/v1/api-tokens/me").hasRole(
                                        AGENT.name()
                                )
                                .requestMatchers("/api/v1/ingest").hasRole(
                                        AGENT.name()
                                )
                                .requestMatchers(GET, "/api/v1/**").hasAnyAuthority(
                                        USER_READ.toString()
                                )
                                .requestMatchers("/api/v1/**").hasAnyRole(
                                        USER.name(), ADMIN.name()
                                )
                                .anyRequest().authenticated()
                )
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .authenticationEntryPoint(authenticationEntryPoint)
                );
        return http.build();
    }
}
