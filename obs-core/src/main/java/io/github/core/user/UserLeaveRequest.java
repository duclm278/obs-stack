package io.github.core.user;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.util.UUID;

@Data
@Builder
@Jacksonized
public class UserLeaveRequest {
    UUID projectId;
}
