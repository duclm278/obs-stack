package io.github.core.scope;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.UUID;

@RequiredArgsConstructor
public class ProjectScope implements GrantedAuthority {
    private final String projectId;

    public ProjectScope(UUID projectId) {
        this(projectId.toString());
    }

    @Override
    public String getAuthority() {
        return toString();
    }

    @Override
    public String toString() {
        return "project:" + projectId;
    }
}
