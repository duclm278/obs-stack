package io.github.core.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("me")
    public ResponseEntity<User> findMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(user);
    }

    @PatchMapping("me")
    public ResponseEntity<User> updateById(
            @Valid @RequestBody UserSelfUpdateRequest userSelfUpdateRequest
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        UUID userId = user.getId();
        UserUpdateRequest userUpdateRequest = UserUpdateRequest.builder()
                .password(userSelfUpdateRequest.getPassword())
                .build();
        User updatedUser = userService.updateById(userId, userUpdateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping
    public ResponseEntity<User> create(
            @Valid @RequestBody UserCreateRequest userCreateRequest
    ) {
        User user = userService.create(userCreateRequest);
        return ResponseEntity.ok(user);
    }

    @GetMapping("{id}")
    public ResponseEntity<User> findById(@PathVariable UUID id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public PagedModel<User> findAll(Pageable pageable) {
        Page<User> userPage = userService.findAll(pageable);
        return new PagedModel<>(userPage);
    }

    @PatchMapping("{id}")
    public ResponseEntity<User> updateById(
            @PathVariable UUID id,
            @Valid @RequestBody UserUpdateRequest userUpdateRequest
    ) {
        User user = userService.updateById(id, userUpdateRequest);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/join")
    public ResponseEntity<Void> join(
            @PathVariable UUID id,
            @Valid @RequestBody UserJoinRequest userJoinRequest
    ) {
        userService.join(id, userJoinRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("{id}/leave")
    public ResponseEntity<Void> leave(
            @PathVariable UUID id,
            @Valid @RequestBody UserLeaveRequest userLeaveRequest
    ) {
        userService.leave(id, userLeaveRequest);
        return ResponseEntity.ok().build();
    }
}
