package io.github.core.scope;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

import static io.github.core.scope.RoleScope.*;

@Getter
@RequiredArgsConstructor
public enum Role implements GrantedAuthority {
    USER(
            Set.of(
                    USER_READ, USER_CREATE, USER_UPDATE, USER_DELETE
            )
    ),
    ADMIN(
            Set.of(
                    USER_READ, USER_CREATE, USER_UPDATE, USER_DELETE,
                    ADMIN_READ, ADMIN_CREATE, ADMIN_UPDATE, ADMIN_DELETE
            )
    ),
    GUEST(
            Set.of(
                    USER_READ
            )
    ),
    AGENT(
            Set.of(
                    USER_CREATE
            )
    );

    private final Set<RoleScope> scopes;

    public Set<String> getAuthorities() {
        Set<String> authorities = scopes.stream()
                .map(RoleScope::getAuthority)
                .collect(Collectors.toSet());
        authorities.add(getAuthority());
        return authorities;
    }

    @Override
    public String getAuthority() {
        return toString();
    }

    @Override
    public String toString() {
        return "ROLE_" + this.name();
    }
}
