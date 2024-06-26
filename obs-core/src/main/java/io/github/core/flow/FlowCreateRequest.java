package io.github.core.flow;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.util.UUID;

@Data
@Builder
@Jacksonized
public class FlowCreateRequest {
    @NotNull
    private String name;
    private String description;
    @NotNull
    private UUID environmentId;
    @Builder.Default
    private String schedule = "@hourly";
    @Builder.Default
    private boolean enabled = true;
}
