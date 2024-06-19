package io.github.core.token;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class ApiTokenCreateRequest {
    @NotNull
    String name;
}
