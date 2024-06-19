package io.github.core.token;

import io.github.core.user.User;
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

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/v1/api-tokens")
@RequiredArgsConstructor
public class UserApiTokenController {
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
    public ResponseEntity<ApiToken> findById(@PathVariable UUID id) {
        ApiToken apiToken = apiTokenService.findById(id);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        if (!user.getProjects().contains(apiToken.getProject())) {
            throw new ResponseStatusException(NOT_FOUND, "API token not found");
        }
        return ResponseEntity.ok(apiToken);
    }

    @GetMapping
    public ResponseEntity<Page<ApiToken>> findAll(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            Pageable pageable
    ) {
        Page<ApiToken> apiTokens = apiTokenService.findByProjectId(projectId, pageable);
        return ResponseEntity.ok(apiTokens);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        ApiToken apiToken = apiTokenService.findById(id);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        if (!user.getProjects().contains(apiToken.getProject())) {
            throw new ResponseStatusException(NOT_FOUND, "API token not found");
        }
        apiTokenService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
