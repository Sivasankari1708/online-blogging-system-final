package com.blog.postservice.service;

import com.blog.postservice.dto.CreatePostRequest;
import com.blog.postservice.dto.PostResponse;
import com.blog.postservice.dto.UpdatePostRequest;

import java.util.List;

public interface PostService {

    // --- Existing operations (preserved) ---
    PostResponse createPost(String authorId, String authorName, CreatePostRequest request);

    PostResponse getPostById(String postId);

    List<PostResponse> getPostsByAuthor(String authorId);

    List<PostResponse> getPublishedPosts();

    // --- New operations ---
    PostResponse updatePost(String postId, String authorId, UpdatePostRequest request);

    void deletePost(String postId, String authorId);

    PostResponse publishPost(String postId, String authorId);

    PostResponse unpublishPost(String postId, String authorId);

    PostResponse incrementViewCount(String postId);

    List<PostResponse> searchPosts(String keyword);

    List<PostResponse> getPostsByTag(String tag);

    List<PostResponse> getDraftsByAuthor(String authorId);
}