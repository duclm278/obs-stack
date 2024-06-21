package io.github.core.token;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import java.util.UUID;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(schema = "public", name = "api_token")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    @JsonIgnore
    private String hashedValue;

    @Column(nullable = false)
    private String hint;

    @Column(nullable = false)
    @Builder.Default
    private boolean isEnabled = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean isMultiTenant = false;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
