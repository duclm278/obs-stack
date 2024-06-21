package io.github.core.project;

import io.github.core.user.ProjectScope;
import io.github.core.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class UserProjectController {
    private final ProjectService projectService;

    @GetMapping("{id}")
    public ResponseEntity<Project> findById(@PathVariable UUID id) {
        ProjectScope projectScope = new ProjectScope(id);
        SimpleGrantedAuthority projectAuthority = new SimpleGrantedAuthority(projectScope.toString());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!authentication.getAuthorities().contains(projectAuthority)) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
        Project project = projectService.findById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public PagedModel<Project> findAll(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        UUID userId = user.getId();
        Page<Project> projectPage = projectService.findAllByUserId(userId, pageable);
        return new PagedModel<>(projectPage);
    }

    @PatchMapping("{id}")
    public ResponseEntity<Project> updateById(
            @PathVariable UUID id,
            @RequestBody ProjectUpdateRequest projectUpdateRequest
    ) {
        ProjectScope projectScope = new ProjectScope(id);
        SimpleGrantedAuthority projectAuthority = new SimpleGrantedAuthority(projectScope.toString());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!authentication.getAuthorities().contains(projectAuthority)) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
        Project project = projectService.updateById(id, projectUpdateRequest);
        return ResponseEntity.ok(project);
    }
}
