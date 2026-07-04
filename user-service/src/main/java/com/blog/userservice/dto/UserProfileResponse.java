package com.blog.userservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserProfileResponse {

    private String id;
    private String userId;
    private String username;
    private String displayName;
    private String email;
    private String bio;
    private String about;
    private String pronouns;
    private String profileImageUrl;
    private String customDomain;
    private String location;
    private String website;
    private Instant joinedAt;
}
