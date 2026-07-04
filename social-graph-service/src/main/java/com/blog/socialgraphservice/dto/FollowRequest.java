package com.blog.socialgraphservice.dto;

import lombok.Data;

@Data
public class FollowRequest {
    private String followerId;
    private String followingId;
}


