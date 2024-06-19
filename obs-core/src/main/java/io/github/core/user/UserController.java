package io.github.core.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
}
