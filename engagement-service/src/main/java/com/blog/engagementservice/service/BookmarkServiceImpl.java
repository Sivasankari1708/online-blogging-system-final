package com.blog.engagementservice.service;

import com.blog.engagementservice.dto.BookmarkResponse;
import com.blog.engagementservice.dto.CreateBookmarkRequest;
import com.blog.engagementservice.model.Bookmark;
import com.blog.engagementservice.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    @Override
    public BookmarkResponse bookmarkPost(CreateBookmarkRequest request) {
        if (bookmarkRepository.existsByUserIdAndPostId(request.getUserId(), request.getPostId())) {
            throw new RuntimeException("Post already bookmarked");
        }

        Bookmark bookmark = Bookmark.builder()
                .userId(request.getUserId())
                .postId(request.getPostId())
                .savedAt(Instant.now())
                .build();

        Bookmark saved = bookmarkRepository.save(bookmark);

        return mapToResponse(saved);
    }

    @Override
    public void removeBookmark(String userId, String postId) {
        bookmarkRepository.deleteByUserIdAndPostId(userId, postId);
    }

    @Override
    public boolean isPostBookmarked(String userId, String postId) {
        return bookmarkRepository.existsByUserIdAndPostId(userId, postId);
    }

    @Override
    public List<BookmarkResponse> getBookmarksByUser(String userId) {
        return bookmarkRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BookmarkResponse mapToResponse(Bookmark bookmark) {
        return BookmarkResponse.builder()
                .id(bookmark.getId())
                .userId(bookmark.getUserId())
                .postId(bookmark.getPostId())
                .savedAt(bookmark.getSavedAt())
                .build();
    }
}