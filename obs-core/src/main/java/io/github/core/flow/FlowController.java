package io.github.core.flow;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
@RequestMapping("/api/v1/flows")
@RequiredArgsConstructor
public class FlowController {
    private final FlowService flowService;

    @PostMapping
    public ResponseEntity<Flow> create(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @Valid @RequestPart("flow") FlowCreateRequest flowCreateRequest,
            @RequestPart("file") MultipartFile file
    ) {
        byte[] notebook;
        try {
            notebook = file.getBytes();
        } catch (Exception e) {
            throw new ResponseStatusException(BAD_REQUEST, e.getMessage());
        }
        Flow flow = flowService.create(projectId, flowCreateRequest, notebook);
        return ResponseEntity.ok(flow);
    }

    @GetMapping("{id}")
    public ResponseEntity<Flow> findById(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @PathVariable UUID id
    ) {
        Flow flow = flowService.findById(projectId, id);
        return ResponseEntity.ok(flow);
    }

    @GetMapping
    public PagedModel<Flow> findByProjectId(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            Pageable pageable
    ) {
        Page<Flow> flowPage = flowService.findByProjectId(projectId, pageable);
        return new PagedModel<>(flowPage);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(
            @NotNull @RequestHeader("X-ProjectID") UUID projectId,
            @PathVariable UUID id
    ) {
        flowService.deleteById(projectId, id);
        return ResponseEntity.noContent().build();
    }
}
