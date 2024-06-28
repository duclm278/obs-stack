package io.github.core.forecast;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Data
@Builder
@Jacksonized
public class ForecastUpdateRequest {
    private List<Prediction> predictions;
}
