package com.blog.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateNotificationRequest {

    @NotBlank
    private String userId;

    @NotBlank
    private String type;

    @NotBlank
    private String referenceId;

    @NotBlank
    private String message;
}