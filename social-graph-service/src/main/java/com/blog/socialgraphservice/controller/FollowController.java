package com.blog.socialgraphservice.controller;

import com.blog.socialgraphservice.dto.FollowRequest;
import com.blog.socialgraphservice.dto.FollowResponse;
import com.blog.socialgraphservice.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/social")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<Map<String, String>> follow(@RequestBody FollowRequest request) {
        followService.follow(request);
        return ResponseEntity.ok(Map.of("message", "User followed successfully"));
    }

    @PostMapping("/unfollow")
    public ResponseEntity<Map<String, String>> unfollow(@RequestBody FollowRequest request) {
        followService.unfollow(request);
        return ResponseEntity.ok(Map.of("message", "User unfollowed successfully"));
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<FollowResponse>> followers(@PathVariable String userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<FollowResponse>> following(@PathVariable String userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }

    @GetMapping("/followers/{userId}/count")
    public ResponseEntity<Map<String, Long>> countFollowers(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("count", followService.countFollowers(userId)));
    }

    @GetMapping("/following/{userId}/count")
    public ResponseEntity<Map<String, Long>> countFollowing(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("count", followService.countFollowing(userId)));
    }

    @GetMapping("/is-following")
    public ResponseEntity<Map<String, Boolean>> isFollowing(
            @RequestParam String followerId, 
            @RequestParam String followingId) {
        return ResponseEntity.ok(Map.of("isFollowing", followService.isFollowing(followerId, followingId)));
    }
}
