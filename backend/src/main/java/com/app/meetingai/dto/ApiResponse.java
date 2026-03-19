package com.app.meetingai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

/**
 * Standard API response wrapper for consistent response format across all endpoints.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        Instant timestamp,
        PageInfo page
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, data, Instant.now(), null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, Instant.now(), null);
    }

    public static <T> ApiResponse<T> success(T data, PageInfo page) {
        return new ApiResponse<>(true, null, data, Instant.now(), page);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, Instant.now(), null);
    }

    public record PageInfo(int page, int size, long totalElements, int totalPages) {}
}
