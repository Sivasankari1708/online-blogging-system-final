package com.blog.userservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * UserProfile document — stores all public-facing profile information.
 * The userId matches the User.id from auth-service.
 * This allows profile data to be managed independently from auth data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "user_profiles")
public class UserProfile {

    @Id
    private String id;

    /**
     * References the User.id from auth-service's users collection.
     * Acts as the shared identity across all services.
     */
    @Indexed(unique = true)
    private String userId;

    @Indexed(unique = true)
    @TextIndexed
    private String username;

    @TextIndexed
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

    private Instant updatedAt;
}
