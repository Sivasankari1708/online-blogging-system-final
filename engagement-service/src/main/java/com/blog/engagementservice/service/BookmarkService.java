package com.blog.engagementservice.service;

import com.blog.engagementservice.dto.BookmarkResponse;
import com.blog.engagementservice.dto.CreateBookmarkRequest;

import java.util.List;

public interface BookmarkService {

    BookmarkResponse bookmarkPost(CreateBookmarkRequest request);

    void removeBookmark(String userId, String postId);

    boolean isPostBookmarked(String userId, String postId);

    List<BookmarkResponse> getBookmarksByUser(String userId);
}