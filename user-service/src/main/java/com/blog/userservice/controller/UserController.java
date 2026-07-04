package com.blog.userservice.controller;

import com.blog.userservice.dto.CreateProfileRequest;
import com.blog.userservice.dto.UpdateProfileRequest;
import com.blog.userservice.dto.UserProfileResponse;
import com.blog.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User Profile REST Controller.
 *
 * POST   /users/profiles             — Create a new user profile (called after registration)
 * GET    /users/profiles/{userId}    — Get profile by userId
 * GET    /users/profiles/by-username/{username} — Get profile by username
 * PUT    /users/profiles/{userId}    — Update profile (partial update)
 * GET    /users/search?q={query}     — Search users by username or display name
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Create a user profile. Called right after registration in auth-service.
     * The userId, username, and email come from the JWT claims sent by the client.
     */
    @PostMapping("/profiles")
    public ResponseEntity<UserProfileResponse> createProfile(
            @Valid @RequestBody CreateProfileRequest request) {
        UserProfileResponse response = userService.createProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get a user's profile by their userId (extracted from JWT in other services).
     */
    @GetMapping("/profiles/{userId}")
    public ResponseEntity<UserProfileResponse> getProfileByUserId(@PathVariable String userId) {
        UserProfileResponse response = userService.getProfileByUserId(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a user's profile by their public username (for profile pages).
     */
    @GetMapping("/profiles/by-username/{username}")
    public ResponseEntity<UserProfileResponse> getProfileByUsername(@PathVariable String username) {
        UserProfileResponse response = userService.getProfileByUsername(username);
        return ResponseEntity.ok(response);
    }

    /**
     * Update the current user's profile.
     * In a full implementation, userId would be extracted from the JWT.
     * For now, it is passed as a path variable (gateway will inject it later).
     */
    @PutMapping("/profiles/{userId}")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable String userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Search users by username or display name.
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserProfileResponse>> searchUsers(
            @RequestParam("q") String query) {
        List<UserProfileResponse> results = userService.searchUsers(query);
        return ResponseEntity.ok(results);
    }
}
