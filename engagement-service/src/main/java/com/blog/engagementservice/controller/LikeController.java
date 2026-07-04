package com.blog.engagementservice.controller;

import com.blog.engagementservice.dto.CreateLikeRequest;
import com.blog.engagementservice.dto.LikeResponse;
import com.blog.engagementservice.service.LikeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<LikeResponse> likePost(@Valid @RequestBody CreateLikeRequest request) {
        LikeResponse response = likeService.likePost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> unlikePost(@RequestParam String userId, @RequestParam String postId) {
        likeService.unlikePost(userId, postId);
        return ResponseEntity.ok(Map.of("message", "Post unliked"));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> isLiked(@RequestParam String userId, @RequestParam String postId) {
        boolean isLiked = likeService.isPostLiked(userId, postId);
        return ResponseEntity.ok(Map.of("liked", isLiked));
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Map<String, Long>> getLikeCount(@PathVariable String postId) {
        long count = likeService.getLikeCount(postId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}