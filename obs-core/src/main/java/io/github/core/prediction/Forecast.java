package io.github.core.prediction;

import com.fasterxml.jackson.annotation.*;
import io.github.core.flow.Flow;
import io.github.core.project.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(schema = "public", name = "forecast")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Forecast {
    @Id
    private UUID id;

    @OneToMany(
            mappedBy = "forecast",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Prediction> predictions = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JsonIgnore
    private Flow flow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonProperty("projectId")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Project project;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
