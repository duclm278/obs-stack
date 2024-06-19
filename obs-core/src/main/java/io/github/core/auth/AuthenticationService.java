package io.github.core.auth;

import io.github.core.scope.Role;
import io.github.core.token.JwtService;
import io.github.core.user.User;
import io.github.core.user.UserCreateRequest;
import io.github.core.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final PasswordEncoder bCryptPasswordEncoder;
    private final JwtService jwtService;

    public User signup(SignupRequest body) {
        String username = body.getUsername();
        String password = body.getPassword();
        UserCreateRequest userCreateRequest = UserCreateRequest.builder()
                .username(username)
                .password(password)
                .role(Role.USER)
                .build();
        return userService.create(userCreateRequest);
    }

    public String login(LoginRequest body) {
        String username = body.getUsername();
        User user = userService.findByUsername(username);
        String password = body.getPassword();
        String hashedPassword = user.getHashedPassword();
        if (!bCryptPasswordEncoder.matches(password, hashedPassword)) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid credentials");
        }
        List<String> scopes = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        Map<String, Object> extraClaims = Map.of("scopes", scopes);
        return jwtService.createToken(username, extraClaims);
    }
}
