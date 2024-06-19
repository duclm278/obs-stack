package io.github.core.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {
    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> create(
            @Valid @RequestBody ProjectCreateRequest projectCreateRequest
    ) {
        Project project = projectService.create(projectCreateRequest);
        return ResponseEntity.ok(project);
    }

    @GetMapping("{id}")
    public ResponseEntity<Project> findById(@PathVariable UUID id) {
        Project project = projectService.findById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public PagedModel<Project> findAll(Pageable pageable) {
        Page<Project> projectPage = projectService.findAll(pageable);
        return new PagedModel<>(projectPage);
    }

    @PatchMapping("{id}")
    public ResponseEntity<Project> updateById(
            @PathVariable UUID id,
            @RequestBody ProjectUpdateRequest projectUpdateRequest
    ) {
        Project project = projectService.updateById(id, projectUpdateRequest);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        projectService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
