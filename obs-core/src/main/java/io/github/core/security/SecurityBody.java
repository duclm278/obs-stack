package io.github.core.security;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Data
@Builder
@Jacksonized
public class SecurityBody {
    @Builder.Default
    @JsonFormat(
            shape = JsonFormat.Shape.STRING,
            pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    )
    private OffsetDateTime timestamp = OffsetDateTime.now(ZoneOffset.UTC);
    private int status;
    private String error;
    private String message;
    private String path;
}
