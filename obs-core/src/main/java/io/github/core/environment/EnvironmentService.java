package io.github.core.environment;

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
public class EnvironmentService {
    private final EnvironmentRepository environmentRepository;

    public Environment create(EnvironmentCreateRequest environmentCreateRequest) {
        Environment environment = Environment.builder()
                .name(environmentCreateRequest.getName())
                .description(environmentCreateRequest.getDescription())
                .image(environmentCreateRequest.getImage())
                .build();
        return environmentRepository.save(environment);
    }

    public Environment findById(UUID id) {
        Optional<Environment> optionalEnvironment = environmentRepository.findById(id);
        if (optionalEnvironment.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Environment not found");
        }
        return optionalEnvironment.get();
    }

    public boolean existsById(UUID id) {
        return environmentRepository.existsById(id);
    }

    public Environment getReferenceById(UUID id) {
        return environmentRepository.getReferenceById(id);
    }

    public Page<Environment> findAll(Pageable pageable) {
        return environmentRepository.findAll(pageable);
    }

    public Environment updateById(UUID id, EnvironmentUpdateRequest environmentUpdateRequest) {
        Optional<Environment> optionalEnvironment = environmentRepository.findById(id);
        if (optionalEnvironment.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Environment not found");
        }
        Environment environment = optionalEnvironment.get();
        String name = environmentUpdateRequest.getName();
        if (name != null) {
            environment.setName(name);
        }
        String description = environmentUpdateRequest.getDescription();
        if (description != null) {
            environment.setDescription(description);
        }
        String image = environmentUpdateRequest.getImage();
        if (image != null) {
            environment.setImage(image);
        }
        return environmentRepository.save(environment);
    }

    public void deleteById(UUID id) {
        if (!environmentRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Environment not found");
        }
        environmentRepository.deleteById(id);
    }
}
