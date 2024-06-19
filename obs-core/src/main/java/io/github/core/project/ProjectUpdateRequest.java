package io.github.core.project;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class ProjectUpdateRequest {
    String name;
    String description;
}
