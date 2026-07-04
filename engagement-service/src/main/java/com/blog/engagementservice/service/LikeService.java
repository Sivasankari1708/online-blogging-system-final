package com.blog.engagementservice.service;

import com.blog.engagementservice.dto.CreateLikeRequest;
import com.blog.engagementservice.dto.LikeResponse;

public interface LikeService {

    LikeResponse likePost(CreateLikeRequest request);

    void unlikePost(String userId, String postId);

    boolean isPostLiked(String userId, String postId);

    long getLikeCount(String postId);
}