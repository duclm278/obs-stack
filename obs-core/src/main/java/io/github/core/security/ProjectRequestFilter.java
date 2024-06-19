package io.github.core.security;

import io.github.core.scope.ProjectScope;
import io.github.core.scope.Role;
import io.github.core.scope.RoleScope;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProjectRequestFilter extends OncePerRequestFilter {
    private final AccessDeniedHandler accessDeniedHandler;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("X-ProjectID");
        if (header == null) {
            filterChain.doFilter(request, response);
            return;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            UUID projectId = UUID.fromString(header);
            ProjectScope projectScope = new ProjectScope(projectId);
            GrantedAuthority projectAuthority = new SimpleGrantedAuthority(projectScope.toString());
            GrantedAuthority adminAuthority = new SimpleGrantedAuthority(Role.ADMIN.toString());
            if (!authentication.getAuthorities().contains(projectAuthority) &&
                    !authentication.getAuthorities().contains(adminAuthority)) {
                throw new RuntimeException("Project access denied");
            }
        } catch (Exception e) {
            accessDeniedHandler.handle(request, response, new AccessDeniedException(e.getMessage(), e));
            return;
        }
        filterChain.doFilter(request, response);
    }
}
