package com.app.meetingai.service;

import com.app.meetingai.utils.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Local file storage for uploaded meeting audio files.
 */
@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);
    private static final List<String> ALLOWED_AUDIO_EXTENSIONS = Arrays.asList("mp3", "wav", "m4a");
    private static final long MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
        log.info("File storage initialized at: {}", uploadRoot);
    }

    public String store(MultipartFile file) {
        validateFile(file);
        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + ext;
        Path target = uploadRoot.resolve(filename);
        try {
            Files.copy(file.getInputStream(), target);
            return "/uploads/" + filename;
        } catch (IOException e) {
            log.error("Failed to store file: {}", e.getMessage());
            throw new ApiException("Failed to store file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Path getAbsolutePath(String urlPath) {
        if (urlPath == null || !urlPath.startsWith("/uploads/")) {
            return null;
        }
        String filename = urlPath.substring("/uploads/".length());
        return uploadRoot.resolve(filename).normalize();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ApiException("File is empty", HttpStatus.BAD_REQUEST);
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ApiException("File size exceeds 100MB limit", HttpStatus.PAYLOAD_TOO_LARGE);
        }
        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_AUDIO_EXTENSIONS.contains(ext)) {
            throw new ApiException("Invalid format. Allowed: MP3, WAV, M4A", HttpStatus.BAD_REQUEST);
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int i = filename.lastIndexOf('.');
        return i > 0 ? filename.substring(i + 1).toLowerCase() : "";
    }
}
