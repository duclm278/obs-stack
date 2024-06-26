package io.github.core.flow;

import io.github.core.environment.Environment;
import io.github.core.environment.EnvironmentService;
import io.github.core.project.Project;
import io.github.core.project.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA;
import static org.springframework.web.reactive.function.client.ExchangeFilterFunctions.basicAuthentication;

@Service
@RequiredArgsConstructor
public class FlowService {
    private final FlowRepository flowRepository;
    private final ProjectService projectService;
    private final EnvironmentService environmentService;
    private final TemplateEngine dagTemplateEngine;

    @Value("${airflow.host}")
    private String airflowHost;

    @Value("${airflow.username}")
    private String airflowUsername;

    @Value("${airflow.password}")
    private String airflowPassword;

    @Value("${airflow.mode}")
    private String airflowMode;

    @Value("${airflow.docker.url}")
    private String airflowDockerUrl;

    public Flow create(UUID projectId, FlowCreateRequest flowCreateRequest, byte[] notebook) {
        if (!projectService.existsById(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
        Project project = projectService.getReferenceById(projectId);
        Environment environment = environmentService.findById(flowCreateRequest.getEnvironmentId());
        Flow flow = Flow.builder()
                .name(flowCreateRequest.getName())
                .description(flowCreateRequest.getDescription())
                .environment(environment)
                .notebook(notebook)
                .schedule(flowCreateRequest.getSchedule())
                .enabled(flowCreateRequest.isEnabled())
                .project(project)
                .build();
        Flow created = flowRepository.save(flow);

        Context context = new Context();
        context.setVariable("id", created.getId().toString());
        context.setVariable("image", environment.getImage());
        context.setVariable("docker_url", airflowDockerUrl);
        context.setVariable("schedule", flowCreateRequest.getSchedule());
        String template = airflowMode.equals("docker") ? "flow-docker" : "flow-kubernetes";
        byte[] dag = dagTemplateEngine.process(template, context).getBytes();
        created.setDag(dag);

        Flow updated;
        try {
            updated = flowRepository.save(created);
        } catch (Exception e) {
            flowRepository.delete(created);
            throw e;
        }

        WebClient webClient = WebClient.builder()
                .baseUrl("http://" + airflowHost)
                .filter(basicAuthentication(airflowUsername, airflowPassword))
                .build();
        try {
            MultipartBodyBuilder notebookBuilder = new MultipartBodyBuilder();
            notebookBuilder.part("file", new ByteArrayResource(notebook) {
                @Override
                public String getFilename() {
                    return updated.getId() + ".ipynb";
                }
            });
            notebookBuilder.part("force", "true");
            webClient.post()
                    .uri("/api/v1/xtended/upload_file")
                    .contentType(MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(notebookBuilder.build()))
                    .retrieve()
                    .onStatus(status -> status != OK, ClientResponse::createException)
                    .toBodilessEntity()
                    .block();

            MultipartBodyBuilder dagBuilder = new MultipartBodyBuilder();
            dagBuilder.part("dag_file", new ByteArrayResource(dag) {
                @Override
                public String getFilename() {
                    return updated.getId() + ".py";
                }
            });
            dagBuilder.part("force", "true");
            dagBuilder.part("unpause", updated.isEnabled());
            dagBuilder.part("off_sync", "true");
            webClient.post()
                    .uri("/api/v1/xtended/deploy_dag")
                    .contentType(MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(dagBuilder.build()))
                    .retrieve()
                    .onStatus(status -> status != OK, ClientResponse::createException)
                    .toBodilessEntity()
                    .block();
        } catch (Exception e) {
            flowRepository.delete(updated);
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return updated;
    }

    public Flow findById(UUID projectId, UUID id) {
        Optional<Flow> optionalFlow = flowRepository.findById(id);
        if (optionalFlow.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Flow not found");
        }
        Flow flow = optionalFlow.get();
        if (!flow.getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Flow not found");
        }
        return flow;
    }

    public Page<Flow> findByProjectId(UUID projectId, Pageable pageable) {
        return flowRepository.findByProjectId(projectId, pageable);
    }

    public void deleteById(UUID projectId, UUID id) {
        Optional<Flow> optionalFlow = flowRepository.findById(id);
        if (optionalFlow.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "Flow not found");
        }
        if (!optionalFlow.get().getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Flow not found");
        }
        WebClient webClient = WebClient.builder()
                .baseUrl("http://" + airflowHost)
                .filter(basicAuthentication(airflowUsername, airflowPassword))
                .build();
        try {
            webClient.get()
                    .uri("/api/v1/xtended/delete_dag?filename=" + id + ".py")
                    .retrieve()
                    .onStatus(status -> status != OK && status != NOT_FOUND, ClientResponse::createException)
                    .toBodilessEntity()
                    .block();
            webClient.get()
                    .uri("/api/v1/xtended/delete_dag?filename=" + id + ".ipynb")
                    .retrieve()
                    .onStatus(status -> status != OK && status != NOT_FOUND, ClientResponse::createException)
                    .toBodilessEntity()
                    .block();
        } catch (Exception e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Failed to delete flow");
        }
        flowRepository.deleteById(id);
    }
}
