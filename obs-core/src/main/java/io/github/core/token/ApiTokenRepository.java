package io.github.core.token;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiTokenRepository extends JpaRepository<ApiToken, UUID> {
    Optional<ApiToken> findByHashedValue(String hashedValue);

    Page<ApiToken> findByProjectId(UUID projectId, Pageable pageable);
}
