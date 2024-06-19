package io.github.core.token;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/v1/admin/api-tokens")
@RequiredArgsConstructor
public class AdminApiTokenController {
    private final ApiTokenService apiTokenService;

    @GetMapping("me")
    public ResponseEntity<ApiToken> findMe(
            @NotNull @RequestHeader("Authorization") String header
    ) {
        if (!header.startsWith("Token ")) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid header");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ApiToken apiToken = (ApiToken) authentication.getCredentials();
        return ResponseEntity.ok(apiToken);
    }

    @PostMapping
    public ResponseEntity<String> create(
            @RequestHeader("X-ProjectID") UUID projectId,
            @Valid @RequestBody ApiTokenCreateRequest apiTokenCreateRequest
    ) {
        String apiTokenValue = apiTokenService.createToken(projectId, apiTokenCreateRequest);
        return ResponseEntity.ok(apiTokenValue);
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiToken> findById(@PathVariable UUID id) {
        ApiToken apiToken = apiTokenService.findById(id);
        return ResponseEntity.ok(apiToken);
    }

    @GetMapping
    public ResponseEntity<Page<ApiToken>> findAll(Pageable pageable) {
        Page<ApiToken> apiTokens = apiTokenService.findAll(pageable);
        return ResponseEntity.ok(apiTokens);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        apiTokenService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
