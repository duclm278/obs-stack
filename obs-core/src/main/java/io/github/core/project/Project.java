package io.github.core.project;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.github.core.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(schema = "public", name = "project")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    @EqualsAndHashCode.Include
    private String name;

    @Column
    @EqualsAndHashCode.Include
    private String description;

    @ManyToMany(
            mappedBy = "projects"
    )
    @JsonBackReference
    @EqualsAndHashCode.Exclude
    private Set<User> users = new HashSet<>();

    @CreatedDate
    @EqualsAndHashCode.Exclude
    private LocalDateTime createdAt;

    @LastModifiedDate
    @EqualsAndHashCode.Exclude
    private LocalDateTime updatedAt;

    @PreRemove
    private void removeUserAssociations() {
        for (User user : users) {
            user.getProjects().remove(this);
        }
    }
}
