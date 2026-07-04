package com.blog.notificationservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class NotificationResponse {

    private String id;
    private String userId;
    private String type;
    private String referenceId;
    private String message;
    private boolean isRead;
    private Instant createdAt;
}