package io.github.core.user;

import io.github.core.project.Project;
import io.github.core.project.ProjectService;
import io.github.core.scope.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectService projectService;

    public User create(UserCreateRequest userCreateRequest) {
        String username = userCreateRequest.getUsername();
        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(BAD_REQUEST, "Username already exists");
        }
        String password = userCreateRequest.getPassword();
        String hashedPassword = passwordEncoder.encode(password);
        Project project = Project.builder()
                .name("Default")
                .description("This is the default project created by the system.")
                .build();
        Set<Project> projects = Set.of(project);
        Role role = userCreateRequest.getRole();
        User user = User.builder()
                .username(username)
                .hashedPassword(hashedPassword)
                .role(role)
                .projects(projects)
                .build();
        return userRepository.save(user);
    }

    public User findById(UUID id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        return optionalUser.get();
    }

    public User findByUsername(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        return optionalUser.get();
    }

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User updateById(UUID id, UserUpdateRequest userUpdateRequest) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        User user = optionalUser.get();
        String username = userUpdateRequest.getUsername();
        if (username != null) {
            user.setUsername(username);
        }
        String password = userUpdateRequest.getPassword();
        if (password != null) {
            String hashedPassword = passwordEncoder.encode(password);
            user.setHashedPassword(hashedPassword);
        }
        Role role = userUpdateRequest.getRole();
        if (role != null) {
            user.setRole(role);
        }
        return userRepository.save(user);
    }

    public void deleteById(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    public void join(UUID userId, UserJoinRequest userJoinRequest) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        User user = optionalUser.get();
        UUID projectId = userJoinRequest.getProjectId();
        if (projectId != null) {
            if (!projectService.existsById(projectId)) {
                throw new ResponseStatusException(NOT_FOUND, "Project not found");
            }
            Project project = projectService.getReferenceById(projectId);
            user.addProject(project);
        }
        userRepository.save(user);
    }

    public void leave(UUID userId, UserLeaveRequest userLeaveRequest) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        User user = optionalUser.get();
        UUID projectId = userLeaveRequest.getProjectId();
        if (projectId != null) {
            Project project = projectService.getReferenceById(projectId);
            if (!projectService.existsById(projectId)) {
                throw new ResponseStatusException(NOT_FOUND, "Project not found");
            }
            user.removeProject(project);
        }
        userRepository.save(user);
    }
}
