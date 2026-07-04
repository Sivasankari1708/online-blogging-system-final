package com.blog.engagementservice.dto;

import lombok.Data;

@Data
public class CreateBookmarkRequest {
    private String userId;
    private String postId;
}