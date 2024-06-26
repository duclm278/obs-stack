package io.github.core.project;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;

    public Project create(ProjectCreateRequest projectCreateRequest) {
        Project project = Project.builder()
                .name(projectCreateRequest.getName())
                .description(projectCreateRequest.getDescription())
                .build();
        return projectRepository.save(project);
    }

    public Project findById(UUID id) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
        return optionalProject.get();
    }

    public boolean existsById(UUID id) {
        return projectRepository.existsById(id);
    }

    public Project getReferenceById(UUID id) {
        return projectRepository.getReferenceById(id);
    }

    public Page<Project> findAll(Pageable pageable) {
        return projectRepository.findAll(pageable);
    }

    public Page<Project> findAllByUserId(UUID userId, Pageable pageable) {
        return projectRepository.findByUsersId(userId, pageable);
    }

    public Project updateById(UUID id, ProjectUpdateRequest projectUpdateRequest) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
        Project project = optionalProject.get();
        String name = projectUpdateRequest.getName();
        if (name != null) {
            project.setName(name);
        }
        String description = projectUpdateRequest.getDescription();
        if (description != null) {
            project.setDescription(description);
        }
        return projectRepository.save(project);
    }

    public void deleteById(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
        projectRepository.deleteById(id);
    }
}
