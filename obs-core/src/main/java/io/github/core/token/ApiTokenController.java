package io.github.core.token;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/v1/api-tokens")
@RequiredArgsConstructor
public class ApiTokenController {
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
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @Valid @RequestBody ApiTokenCreateRequest apiTokenCreateRequest
    ) {
        String apiTokenValue = apiTokenService.createToken(projectId, apiTokenCreateRequest);
        return ResponseEntity.ok(apiTokenValue);
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiToken> findById(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @PathVariable UUID id
    ) {
        ApiToken apiToken = apiTokenService.findById(projectId, id);
        return ResponseEntity.ok(apiToken);
    }

    @GetMapping
    public PagedModel<ApiToken> findByProjectId(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            Pageable pageable
    ) {
        Page<ApiToken> apiTokenPage = apiTokenService.findByProjectId(projectId, pageable);
        return new PagedModel<>(apiTokenPage);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @PathVariable UUID id
    ) {
        apiTokenService.deleteById(projectId, id);
        return ResponseEntity.noContent().build();
    }
}
