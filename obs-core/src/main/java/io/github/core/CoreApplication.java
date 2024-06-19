package io.github.core;

import io.github.core.scope.Role;
import io.github.core.user.UserCreateRequest;
import io.github.core.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoreApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(
            UserService userService,
            @Value("${admin.username}")
            String adminUsername,
            @Value("${admin.password}")
            String adminPassword
    ) {
        return args -> {
            UserCreateRequest userCreateRequest = UserCreateRequest.builder()
                    .username(adminUsername)
                    .password(adminPassword)
                    .role(Role.ADMIN)
                    .build();
            userService.create(userCreateRequest);
        };
    }
}
