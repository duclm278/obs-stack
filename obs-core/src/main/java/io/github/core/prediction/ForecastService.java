package io.github.core.prediction;

import io.github.core.flow.Flow;
import io.github.core.flow.FlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ForecastService {
    private final ForecastRepository forecastRepository;
    private final FlowService flowService;

    public Forecast createOrUpdateByFlowId(UUID projectId, UUID flowId, ForecastUpdateRequest forecastUpdateRequest) {
        Optional<Forecast> optionalForecast = forecastRepository.findById(flowId);
        if (optionalForecast.isEmpty()) {
            Flow flow = flowService.findById(projectId, flowId);
            Forecast forecast = Forecast.builder()
                    .flow(flow)
                    .project(flow.getProject())
                    .build();
            Forecast created = forecastRepository.save(forecast);
            List<Prediction> predictions = forecastUpdateRequest.getPredictions();
            for (Prediction prediction : predictions) {
                prediction.setForecast(created);
            }
            created.setPredictions(predictions);
            return forecastRepository.save(created);
        }
        if (!optionalForecast.get().getFlow().getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Forecast not found");
        }
        Forecast forecast = optionalForecast.get();
        List<Prediction> predictions = forecast.getPredictions();
        predictions.clear();
        predictions.addAll(forecastUpdateRequest.getPredictions());
        for (Prediction prediction : predictions) {
            prediction.setForecast(forecast);
        }
        return forecastRepository.save(forecast);
    }

    public Forecast findByFlowId(UUID projectId, UUID flowId) {
        Optional<Forecast> optionalForecast = forecastRepository.findById(flowId);
        if (optionalForecast.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Forecast not found");
        }
        Forecast forecast = optionalForecast.get();
        if (!forecast.getFlow().getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Forecast not found");
        }
        return forecast;
    }

    public Page<Forecast> findByProjectId(UUID projectId, Pageable pageable) {
        return forecastRepository.findByProjectId(projectId, pageable);
    }

    public void deleteByFlowId(UUID projectId, UUID flowId) {
        Optional<Forecast> optionalForecast = forecastRepository.findById(flowId);
        if (optionalForecast.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Forecast not found");
        }
        if (!optionalForecast.get().getFlow().getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Forecast not found");
        }
        forecastRepository.deleteById(flowId);
    }
}
