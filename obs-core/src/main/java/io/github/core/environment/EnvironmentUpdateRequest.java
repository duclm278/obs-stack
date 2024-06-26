package io.github.core.environment;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class EnvironmentUpdateRequest {
    String name;
    String description;
    String image;
}
