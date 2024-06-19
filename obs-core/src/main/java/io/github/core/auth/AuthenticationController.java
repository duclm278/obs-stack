package io.github.core.auth;

import io.github.core.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("signup")
    public ResponseEntity<User> signup(
            @Valid @RequestBody SignupRequest body
    ) {
        User user = authenticationService.signup(body);
        return ResponseEntity.ok(user);
    }

    @PostMapping("login")
    public ResponseEntity<String> login(
            @Valid @RequestBody LoginRequest body
    ) {
        String token = authenticationService.login(body);
        return ResponseEntity.ok(token);
    }
}
