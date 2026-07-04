package com.blog.userservice.service;

import com.blog.userservice.dto.CreateProfileRequest;
import com.blog.userservice.dto.UpdateProfileRequest;
import com.blog.userservice.dto.UserProfileResponse;

import java.util.List;

public interface UserService {

    UserProfileResponse createProfile(CreateProfileRequest request);

    UserProfileResponse getProfileByUserId(String userId);

    UserProfileResponse getProfileByUsername(String username);

    UserProfileResponse updateProfile(String userId, UpdateProfileRequest request);

    List<UserProfileResponse> searchUsers(String query);
}
