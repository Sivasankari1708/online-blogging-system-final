package com.blog.engagementservice.service;

import com.blog.engagementservice.dto.CreateLikeRequest;
import com.blog.engagementservice.dto.LikeResponse;
import com.blog.engagementservice.model.Like;
import com.blog.engagementservice.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;

    @Override
    public LikeResponse likePost(CreateLikeRequest request) {

        if (likeRepository.existsByUserIdAndPostId(request.getUserId(), request.getPostId())) {
            throw new RuntimeException("Post already liked");
        }

        Like like = Like.builder()
                .userId(request.getUserId())
                .postId(request.getPostId())
                .createdAt(Instant.now())
                .build();

        Like saved = likeRepository.save(like);

        return LikeResponse.builder()
                .id(saved.getId())
                .userId(saved.getUserId())
                .postId(saved.getPostId())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public void unlikePost(String userId, String postId) {
        likeRepository.deleteByUserIdAndPostId(userId, postId);
    }

    @Override
    public boolean isPostLiked(String userId, String postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }

    @Override
    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }
}