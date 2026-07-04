package com.blog.engagementservice.dto;

import lombok.Data;

@Data
public class CreateLikeRequest {
    private String userId;
    private String postId;
}