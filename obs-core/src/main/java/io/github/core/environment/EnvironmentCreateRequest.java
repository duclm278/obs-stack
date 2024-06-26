package io.github.core.environment;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class EnvironmentCreateRequest {
    String name;
    String description;
    @NotNull
    String image;
}
