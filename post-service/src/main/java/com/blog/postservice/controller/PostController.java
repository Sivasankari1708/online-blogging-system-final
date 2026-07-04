package com.blog.postservice.controller;

import com.blog.postservice.dto.CreatePostRequest;
import com.blog.postservice.dto.PostResponse;
import com.blog.postservice.dto.UpdatePostRequest;
import com.blog.postservice.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * Post REST Controller.
 *
 * POST   /posts                            — Create a new post
 * GET    /posts/{postId}                   — Get post by ID
 * GET    /posts/author/{authorId}          — Get all posts by author
 * GET    /posts/published                  — Get all published posts (feed)
 * PUT    /posts/{postId}                   — Edit post (owner only)
 * DELETE /posts/{postId}                   — Soft delete post (owner only)
 * PATCH  /posts/{postId}/publish           — Publish a draft
 * PATCH  /posts/{postId}/unpublish         — Revert to draft
 * PATCH  /posts/{postId}/view              — Increment view count
 * GET    /posts/search?q={keyword}         — Search published posts
 * GET    /posts/tag/{tag}                  — Posts by tag
 * GET    /posts/drafts/{authorId}          — Get drafts by author
 */
@RestController
@RequestMapping("/posts")
@Slf4j
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestHeader("X-User-Id") String authorId,
            @RequestHeader(value = "X-User-Name", defaultValue = "Unknown") String authorName,
            @Valid @RequestBody CreatePostRequest request) {
            
        log.info("Received createPost request from user: {} ({})", authorName, authorId);
        PostResponse response = postService.createPost(authorId, authorName, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable String postId) {
        PostResponse response = postService.getPostById(postId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<PostResponse>> getPostsByAuthor(@PathVariable String authorId) {
        List<PostResponse> response = postService.getPostsByAuthor(authorId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/published")
    public ResponseEntity<List<PostResponse>> getPublishedPosts() {
        List<PostResponse> response = postService.getPublishedPosts();
        return ResponseEntity.ok(response);
    }

    /**
     * Partial update — only provided fields are updated.
     * authorId is passed as a header (will be injected by gateway from JWT in Phase 9).
     */
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String authorId,
            @Valid @RequestBody UpdatePostRequest request) {
        PostResponse response = postService.updatePost(postId, authorId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Soft delete — marks post as deleted without removing from DB.
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String authorId) {
        postService.deletePost(postId, authorId);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    /**
     * Publish a draft post.
     */
    @PatchMapping("/{postId}/publish")
    public ResponseEntity<PostResponse> publishPost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String authorId) {
        PostResponse response = postService.publishPost(postId, authorId);
        return ResponseEntity.ok(response);
    }

    /**
     * Revert a published post back to draft.
     */
    @PatchMapping("/{postId}/unpublish")
    public ResponseEntity<PostResponse> unpublishPost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String authorId) {
        PostResponse response = postService.unpublishPost(postId, authorId);
        return ResponseEntity.ok(response);
    }

    /**
     * Increment view count — called whenever a post is viewed.
     */
    @PatchMapping("/{postId}/view")
    public ResponseEntity<PostResponse> incrementView(@PathVariable String postId) {
        PostResponse response = postService.incrementViewCount(postId);
        return ResponseEntity.ok(response);
    }

    /**
     * Keyword search across title and content of published posts.
     */
    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> searchPosts(@RequestParam("q") String query) {
        List<PostResponse> response = postService.searchPosts(query);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all published posts with a specific tag.
     */
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<PostResponse>> getPostsByTag(@PathVariable String tag) {
        List<PostResponse> response = postService.getPostsByTag(tag);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all draft (unpublished) posts for a specific author.
     */
    @GetMapping("/drafts/{authorId}")
    public ResponseEntity<List<PostResponse>> getDraftsByAuthor(@PathVariable String authorId) {
        List<PostResponse> response = postService.getDraftsByAuthor(authorId);
        return ResponseEntity.ok(response);
    }
}