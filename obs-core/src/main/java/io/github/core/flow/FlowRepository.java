package io.github.core.flow;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FlowRepository extends JpaRepository<Flow, UUID> {
    Page<Flow> findByProjectId(UUID projectId, Pageable pageable);
}
