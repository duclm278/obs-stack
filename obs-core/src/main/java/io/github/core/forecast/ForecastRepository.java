package io.github.core.forecast;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, UUID> {
    Page<Forecast> findByProjectId(UUID projectId, Pageable pageable);
}
