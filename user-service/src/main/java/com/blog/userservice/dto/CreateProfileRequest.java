package com.blog.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request to create an initial user profile after registration.
 * Called internally right after auth-service creates the user account.
 */
@Data
public class CreateProfileRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;
}
