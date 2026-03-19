package com.app.meetingai.utils;

import org.springframework.http.HttpStatus;

/**
 * Custom API exception for business logic errors.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public HttpStatus getHttpStatus() {
        return status;
    }
}
