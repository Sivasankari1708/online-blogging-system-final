package com.blog.engagementservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class BookmarkResponse {
    private String id;
    private String userId;
    private String postId;
    private Instant savedAt;
}