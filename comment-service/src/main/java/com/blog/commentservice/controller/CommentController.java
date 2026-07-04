package com.blog.commentservice.controller;

import com.blog.commentservice.dto.CommentResponse;
import com.blog.commentservice.dto.CreateCommentRequest;
import com.blog.commentservice.dto.UpdateCommentRequest;
import com.blog.commentservice.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.addComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable String commentId,
            @RequestHeader("X-User-Id") String authorId,
            @Valid @RequestBody UpdateCommentRequest request) {
        CommentResponse response = commentService.updateComment(commentId, authorId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable String commentId,
            @RequestHeader("X-User-Id") String authorId) {
        commentService.deleteComment(commentId, authorId);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable String commentId) {
        CommentResponse response = commentService.getCommentById(commentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable String postId) {
        List<CommentResponse> response = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<CommentResponse>> getReplies(@PathVariable String commentId) {
        List<CommentResponse> response = commentService.getReplies(commentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByAuthor(@PathVariable String authorId) {
        List<CommentResponse> response = commentService.getCommentsByAuthor(authorId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCountForPost(@PathVariable String postId) {
        long count = commentService.getCommentCountForPost(postId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
