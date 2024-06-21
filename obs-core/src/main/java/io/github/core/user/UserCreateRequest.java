package io.github.core.user;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class UserCreateRequest {
    @NotNull
    String username;

    @NotNull
    String password;

    @Builder.Default
    Role role = Role.USER;
}
