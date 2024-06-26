package io.github.core.query;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerMapping;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
public class LogV1Controller {
    @Value("${log.host}")
    private String logHost;

    @GetMapping("**")
    public void query(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String header = request.getHeader("X-ProjectID");
        if (header == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid header");
        }
        String currentPath = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String matchedPath = currentPath.substring("/api/v1/logs".length());
        String target = "http://" + logHost + "/loki/api/v1";
        URI uri = URI.create(target + matchedPath + "?" + request.getQueryString());
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(uri)
                .header("X-ProjectID", header)
                .GET()
                .build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            HttpResponse<byte[]> httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofByteArray());
            response.setStatus(httpResponse.statusCode());
            response.setHeader("Content-Type", "application/json");
            response.getOutputStream().write(httpResponse.body());
        } catch (Exception e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Failed to query logs [v1]");
        }
    }
}
