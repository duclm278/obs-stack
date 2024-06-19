package io.github.core.project;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class ProjectCreateRequest {
    @NotNull
    String name;
    String description;
}
