package io.github.core.auth;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class SignupRequest {
    @NotNull
    private String username;

    @NotNull
    private String password;
}
