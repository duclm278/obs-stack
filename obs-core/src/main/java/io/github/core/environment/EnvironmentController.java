package io.github.core.environment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/environments")
@RequiredArgsConstructor
public class EnvironmentController {
    private final EnvironmentService environmentService;

    @PostMapping
    public ResponseEntity<Environment> create(
            @Valid @RequestBody EnvironmentCreateRequest environmentCreateRequest
    ) {
        Environment environment = environmentService.create(environmentCreateRequest);
        return ResponseEntity.ok(environment);
    }

    @GetMapping("{id}")
    public ResponseEntity<Environment> findById(@PathVariable UUID id) {
        Environment environment = environmentService.findById(id);
        return ResponseEntity.ok(environment);
    }

    @GetMapping
    public PagedModel<Environment> findAll(Pageable pageable) {
        Page<Environment> environmentPage = environmentService.findAll(pageable);
        return new PagedModel<>(environmentPage);
    }

    @PatchMapping("{id}")
    public ResponseEntity<Environment> updateById(
            @PathVariable UUID id,
            @RequestBody EnvironmentUpdateRequest environmentUpdateRequest
    ) {
        Environment environment = environmentService.updateById(id, environmentUpdateRequest);
        return ResponseEntity.ok(environment);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        environmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
