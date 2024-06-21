package io.github.core.security;

import io.github.core.project.Project;
import io.github.core.token.ApiToken;
import io.github.core.token.ApiTokenService;
import io.github.core.user.Role;
import io.github.core.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ApiTokenRequestFilter extends OncePerRequestFilter {
    private final ApiTokenService apiTokenService;
    private final AccessDeniedHandler accessDeniedHandler;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Token ")) {
            String apiTokenValue = header.substring(6);
            if (apiTokenService.isValid(apiTokenValue)) {
                try {
                    String apiTokenHashedValue = apiTokenService.hashToken(apiTokenValue);
                    ApiToken apiToken = apiTokenService.findByHashedValue(apiTokenHashedValue);
                    Project project = apiToken.getProject();
                    Set<Project> projects = Set.of(project);
                    User apiUser = User.builder()
                            .username("agent")
                            .hashedPassword("")
                            .role(Role.AGENT)
                            .projects(projects)
                            .build();
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            apiUser,
                            apiToken,
                            apiUser.getAuthorities()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    accessDeniedHandler.handle(request, response, new AccessDeniedException(e.getMessage(), e));
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
