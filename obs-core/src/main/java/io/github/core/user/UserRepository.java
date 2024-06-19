package io.github.core.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u JOIN FETCH u.projects WHERE u.username = :username")
    Optional<User> findByUsername(String username);
}
