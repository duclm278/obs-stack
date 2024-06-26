package io.github.core.token;

import io.github.core.project.Project;
import io.github.core.project.ProjectService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.unbrokendome.base62.Base62;

import java.security.SecureRandom;
import java.util.Optional;
import java.util.UUID;
import java.util.zip.CRC32;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ApiTokenService {
    private static final String PREFIX = "ost";

    private final ApiTokenRepository apiTokenRepository;
    private final ProjectService projectService;

    @Value("${crc.secret-key}")
    private String crcSecretKey;

    public ApiToken findById(UUID projectId, UUID id) {
        Optional<ApiToken> optionalApiToken = apiTokenRepository.findById(id);
        if (optionalApiToken.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "API token not found");
        }
        ApiToken apiToken = optionalApiToken.get();
        if (!apiToken.getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "API token not found");
        }
        return apiToken;
    }

    public ApiToken findByHashedValue(String hashedValue) {
        Optional<ApiToken> optionalApiToken = apiTokenRepository.findByHashedValue(hashedValue);
        if (optionalApiToken.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "API token not found");
        }
        return optionalApiToken.get();
    }

    public Page<ApiToken> findByProjectId(UUID projectId, Pageable pageable) {
        return apiTokenRepository.findByProjectId(projectId, pageable);
    }

    public String createToken(UUID projectId, ApiTokenCreateRequest apiTokenCreateRequest) {
        if (!projectService.existsById(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "Project not found");
        }
        Project project = projectService.getReferenceById(projectId);

        SecureRandom secureRandom = new SecureRandom();
        StringBuilder randomStringBuilder = new StringBuilder();
        for (int i = 0; i < 2; i++) {
            randomStringBuilder.append(Base62.encode(secureRandom.nextLong()));
        }
        String randomString = randomStringBuilder.toString();
        CRC32 crc32 = new CRC32();
        crc32.update(crcSecretKey.getBytes());
        crc32.update(randomString.getBytes());
        long crc32Value = crc32.getValue();

        String apiTokenValue = PREFIX + "_" + randomString + "_" + crc32Value;
        String apiTokenHashedValue = hashToken(apiTokenValue);
        String apiTokenHint = String.format("%04d", crc32Value % 10000);
        ApiToken apiToken = ApiToken.builder()
                .name(apiTokenCreateRequest.getName())
                .hashedValue(apiTokenHashedValue)
                .hint(apiTokenHint)
                .enabled(apiTokenCreateRequest.isEnabled())
                .project(project)
                .build();

        apiTokenRepository.save(apiToken);
        return apiTokenValue;
    }

    public void deleteById(UUID projectId, UUID id) {
        Optional<ApiToken> optionalApiToken = apiTokenRepository.findById(id);
        if (optionalApiToken.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND, "API token not found");
        }
        if (!optionalApiToken.get().getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(NOT_FOUND, "API token not found");
        }
        apiTokenRepository.deleteById(id);
    }

    public boolean isValid(String apiTokenValue) {
        String[] parts = apiTokenValue.split("_");
        if (parts.length != 3 || !PREFIX.equals(parts[0])) {
            return false;
        }
        String randomString = parts[1];
        CRC32 crc32 = new CRC32();
        crc32.update(crcSecretKey.getBytes());
        crc32.update(randomString.getBytes());
        return String.valueOf(crc32.getValue()).equals(parts[2]);
    }

    public String hashToken(String apiTokenValue) {
        return DigestUtils.sha3_256Hex(apiTokenValue);
    }
}
