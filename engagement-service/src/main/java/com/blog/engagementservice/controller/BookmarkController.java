package com.blog.engagementservice.controller;

import com.blog.engagementservice.dto.BookmarkResponse;
import com.blog.engagementservice.dto.CreateBookmarkRequest;
import com.blog.engagementservice.service.BookmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping
    public ResponseEntity<BookmarkResponse> bookmarkPost(@Valid @RequestBody CreateBookmarkRequest request) {
        BookmarkResponse response = bookmarkService.bookmarkPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> removeBookmark(@RequestParam String userId, @RequestParam String postId) {
        bookmarkService.removeBookmark(userId, postId);
        return ResponseEntity.ok(Map.of("message", "Bookmark removed"));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> isBookmarked(@RequestParam String userId, @RequestParam String postId) {
        boolean isBookmarked = bookmarkService.isPostBookmarked(userId, postId);
        return ResponseEntity.ok(Map.of("bookmarked", isBookmarked));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookmarkResponse>> getBookmarksByUser(@PathVariable String userId) {
        List<BookmarkResponse> response = bookmarkService.getBookmarksByUser(userId);
        return ResponseEntity.ok(response);
    }
}