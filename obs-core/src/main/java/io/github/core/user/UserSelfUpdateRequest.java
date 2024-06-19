package io.github.core.user;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class UserSelfUpdateRequest {
    String password;
}
