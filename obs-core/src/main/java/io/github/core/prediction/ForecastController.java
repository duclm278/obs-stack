package io.github.core.prediction;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/forecasts")
@RequiredArgsConstructor
public class ForecastController {
    private final ForecastService forecastService;

    @PutMapping("{flowId}")
    public ResponseEntity<Forecast> update(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @PathVariable UUID flowId,
            @Valid @RequestBody ForecastUpdateRequest forecastUpdateRequest
    ) {
        Forecast forecast = forecastService.createOrUpdateByFlowId(projectId, flowId, forecastUpdateRequest);
        return ResponseEntity.ok(forecast);
    }

    @GetMapping("{flowId}")
    public ResponseEntity<Forecast> findByFlowId(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @PathVariable UUID flowId
    ) {
        Forecast forecast = forecastService.findByFlowId(projectId, flowId);
        return ResponseEntity.ok(forecast);
    }

    @GetMapping
    public PagedModel<Forecast> findAll(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            Pageable pageable
    ) {
        Page<Forecast> forecastPage = forecastService.findByProjectId(projectId, pageable);
        return new PagedModel<>(forecastPage);
    }

    @DeleteMapping("{flowId}")
    public ResponseEntity<Void> deleteById(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @PathVariable UUID flowId
    ) {
        forecastService.deleteByFlowId(projectId, flowId);
        return ResponseEntity.noContent().build();
    }
}
