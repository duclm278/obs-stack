package io.github.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class SecurityHandler implements AccessDeniedHandler {
    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {
        String message;
        Throwable cause = accessDeniedException.getCause();
        if (cause instanceof ResponseStatusException responseStatusException) {
            message = responseStatusException.getReason();
        } else {
            message = accessDeniedException.getMessage();
        }
        SecurityBody securityBody = SecurityBody.builder()
                .status(FORBIDDEN.value())
                .error(FORBIDDEN.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json()
                .build();
        String body = objectMapper.writeValueAsString(securityBody);
        response.setStatus(FORBIDDEN.value());
        response.setContentType(APPLICATION_JSON_VALUE);
        response.getWriter().write(body);
    }
}
