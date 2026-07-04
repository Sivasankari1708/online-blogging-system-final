package com.blog.socialgraphservice.service;

import com.blog.socialgraphservice.dto.FollowRequest;
import com.blog.socialgraphservice.dto.FollowResponse;
import com.blog.socialgraphservice.node.UserNode;
import com.blog.socialgraphservice.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;

    public void follow(FollowRequest request) {
        followRepository.followUser(
                request.getFollowerId(),
                request.getFollowingId()
        );
    }

    public void unfollow(FollowRequest request) {
        followRepository.unfollowUser(
                request.getFollowerId(),
                request.getFollowingId()
        );
    }

    public List<FollowResponse> getFollowers(String userId) {
        return followRepository.getFollowers(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FollowResponse> getFollowing(String userId) {
        return followRepository.getFollowing(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long countFollowers(String userId) {
        return followRepository.countFollowers(userId);
    }

    public long countFollowing(String userId) {
        return followRepository.countFollowing(userId);
    }

    public boolean isFollowing(String followerId, String followingId) {
        return followRepository.isFollowing(followerId, followingId);
    }

    private FollowResponse mapToResponse(UserNode node) {
        return FollowResponse.builder()
                .id(node.getUserId())
                .userId(node.getUserId())
                .username(node.getUsername())
                .build();
    }
}