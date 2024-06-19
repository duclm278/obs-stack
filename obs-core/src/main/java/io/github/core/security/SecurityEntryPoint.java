package io.github.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class SecurityEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {
        SecurityBody securityBody = SecurityBody.builder()
                .status(UNAUTHORIZED.value())
                .error(UNAUTHORIZED.getReasonPhrase())
                .message(authException.getMessage())
                .path(request.getRequestURI())
                .build();
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json()
                .build();
        String body = objectMapper.writeValueAsString(securityBody);
        response.setStatus(UNAUTHORIZED.value());
        response.setContentType(APPLICATION_JSON_VALUE);
        response.getWriter().write(body);
    }
}
