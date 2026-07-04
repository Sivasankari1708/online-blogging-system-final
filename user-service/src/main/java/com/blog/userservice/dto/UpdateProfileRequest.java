package com.blog.userservice.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body for editing a user profile.
 * All fields are optional — only non-null fields will be updated.
 */
@Data
public class UpdateProfileRequest {

    @Size(max = 30, message = "Display name must not exceed 30 characters")
    private String displayName;

    @Size(max = 200, message = "Bio must not exceed 200 characters")
    private String bio;

    @Size(max = 2000, message = "About must not exceed 2000 characters")
    private String about;

    @Size(max = 50, message = "Pronouns must not exceed 50 characters")
    private String pronouns;

    private String profileImageUrl;

    private String customDomain;

    private String location;

    private String website;
}
