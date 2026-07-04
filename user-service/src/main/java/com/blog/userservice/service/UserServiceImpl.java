package com.blog.userservice.service;

import com.blog.userservice.dto.CreateProfileRequest;
import com.blog.userservice.dto.UpdateProfileRequest;
import com.blog.userservice.dto.UserProfileResponse;
import com.blog.userservice.exception.ProfileAlreadyExistsException;
import com.blog.userservice.exception.UserProfileNotFoundException;
import com.blog.userservice.model.UserProfile;
import com.blog.userservice.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserProfileRepository userProfileRepository;

    public UserServiceImpl(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public UserProfileResponse createProfile(CreateProfileRequest request) {
        if (userProfileRepository.existsByUserId(request.getUserId())) {
            throw new ProfileAlreadyExistsException("Profile already exists for this user");
        }

        Instant now = Instant.now();

        UserProfile profile = UserProfile.builder()
                .userId(request.getUserId())
                .username(request.getUsername())
                .displayName(request.getUsername())
                .email(request.getEmail())
                .joinedAt(now)
                .updatedAt(now)
                .build();

        UserProfile saved = userProfileRepository.save(profile);
        return mapToResponse(saved);
    }

    @Override
    public UserProfileResponse getProfileByUserId(String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException(
                        "User profile not found for userId: " + userId));
        return mapToResponse(profile);
    }

    @Override
    public UserProfileResponse getProfileByUsername(String username) {
        UserProfile profile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new UserProfileNotFoundException(
                        "User profile not found for username: " + username));
        return mapToResponse(profile);
    }

    @Override
    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException(
                        "User profile not found for userId: " + userId));

        // Partial update — only update non-null fields
        if (request.getDisplayName() != null) {
            profile.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getAbout() != null) {
            profile.setAbout(request.getAbout());
        }
        if (request.getPronouns() != null) {
            profile.setPronouns(request.getPronouns());
        }
        if (request.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(request.getProfileImageUrl());
        }
        if (request.getCustomDomain() != null) {
            profile.setCustomDomain(request.getCustomDomain());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }
        if (request.getWebsite() != null) {
            profile.setWebsite(request.getWebsite());
        }

        profile.setUpdatedAt(Instant.now());
        UserProfile updated = userProfileRepository.save(profile);
        return mapToResponse(updated);
    }

    @Override
    public List<UserProfileResponse> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return userProfileRepository.searchByUsernameOrDisplayName(query.trim())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private UserProfileResponse mapToResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .username(profile.getUsername())
                .displayName(profile.getDisplayName())
                .email(profile.getEmail())
                .bio(profile.getBio())
                .about(profile.getAbout())
                .pronouns(profile.getPronouns())
                .profileImageUrl(profile.getProfileImageUrl())
                .customDomain(profile.getCustomDomain())
                .location(profile.getLocation())
                .website(profile.getWebsite())
                .joinedAt(profile.getJoinedAt())
                .build();
    }
}
