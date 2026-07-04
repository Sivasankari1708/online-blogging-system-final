package com.blog.postservice.service;

import com.blog.postservice.dto.CreatePostRequest;
import com.blog.postservice.dto.PostResponse;
import com.blog.postservice.dto.UpdatePostRequest;
import com.blog.postservice.model.Post;
import com.blog.postservice.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    // =========================================================
    // EXISTING IMPLEMENTATIONS (unchanged)
    // =========================================================

    @Override
    public PostResponse createPost(String authorId, String authorName, CreatePostRequest request) {
        log.info("Creating new post for user: {} ({}) with title: {}", authorName, authorId, request.getTitle());
        Instant now = Instant.now();

        Post post = Post.builder()
                .authorId(authorId)
                .authorName(authorName)
                .title(request.getTitle())
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .media(request.getMedia())
                .tags(request.getTags())
                .categoryName(request.getCategoryName())
                .coverImageURL(request.getCoverImageURL())
                .likesCount(0)
                .viewsCount(0)
                .sharesCount(0)
                .commentsCount(0)
                .commentsPreview(new ArrayList<>())
                .published(request.isPublished())
                .deleted(false)
                .createdDate(now)
                .updatedDate(now)
                .publishedDate(request.isPublished() ? now : null)
                .build();

        Post saved = postRepository.save(post);
        log.info("Successfully created post with ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public PostResponse getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        return mapToResponse(post);
    }

    @Override
    public List<PostResponse> getPostsByAuthor(String authorId) {
        return postRepository.findByAuthorIdAndDeletedFalseOrderByCreatedDateDesc(authorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<PostResponse> getPublishedPosts() {
        return postRepository.findByPublishedTrueAndDeletedFalseOrderByPublishedDateDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // NEW IMPLEMENTATIONS
    // =========================================================

    @Override
    public PostResponse updatePost(String postId, String authorId, UpdatePostRequest request) {
        Post post = getPostAndVerifyOwnership(postId, authorId);

        // Partial update — only update non-null fields
        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getExcerpt() != null) {
            post.setExcerpt(request.getExcerpt());
        }
        if (request.getTags() != null) {
            post.setTags(request.getTags());
        }
        if (request.getCategoryName() != null) {
            post.setCategoryName(request.getCategoryName());
        }
        if (request.getCoverImageURL() != null) {
            post.setCoverImageURL(request.getCoverImageURL());
        }

        post.setUpdatedDate(Instant.now());
        Post updated = postRepository.save(post);
        return mapToResponse(updated);
    }

    @Override
    public void deletePost(String postId, String authorId) {
        Post post = getPostAndVerifyOwnership(postId, authorId);
        post.setDeleted(true);
        post.setUpdatedDate(Instant.now());
        postRepository.save(post);
    }

    @Override
    public PostResponse publishPost(String postId, String authorId) {
        Post post = getPostAndVerifyOwnership(postId, authorId);

        if (post.isPublished()) {
            throw new RuntimeException("Post is already published");
        }

        Instant now = Instant.now();
        post.setPublished(true);
        post.setPublishedDate(now);
        post.setUpdatedDate(now);

        Post updated = postRepository.save(post);
        return mapToResponse(updated);
    }

    @Override
    public PostResponse unpublishPost(String postId, String authorId) {
        Post post = getPostAndVerifyOwnership(postId, authorId);

        if (!post.isPublished()) {
            throw new RuntimeException("Post is not published");
        }

        post.setPublished(false);
        post.setPublishedDate(null);
        post.setUpdatedDate(Instant.now());

        Post updated = postRepository.save(post);
        return mapToResponse(updated);
    }

    @Override
    public PostResponse incrementViewCount(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        post.setViewsCount(post.getViewsCount() + 1);
        Post updated = postRepository.save(post);
        return mapToResponse(updated);
    }

    @Override
    public List<PostResponse> searchPosts(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }
        return postRepository.searchPublishedByKeyword(keyword.trim())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<PostResponse> getPostsByTag(String tag) {
        return postRepository.findByTagAndPublishedTrueAndDeletedFalse(tag)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<PostResponse> getDraftsByAuthor(String authorId) {
        return postRepository.findDraftsByAuthorId(authorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // HELPERS
    // =========================================================

    /**
     * Fetches a post and verifies the caller is the owner.
     * Throws if post not found, deleted, or author mismatch.
     */
    private Post getPostAndVerifyOwnership(String postId, String authorId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        if (post.isDeleted()) {
            throw new RuntimeException("Post has been deleted");
        }
        if (!post.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to modify this post");
        }
        return post;
    }

    private PostResponse mapToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .authorId(post.getAuthorId())
                .authorName(post.getAuthorName())
                .title(post.getTitle())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .media(post.getMedia())
                .tags(post.getTags())
                .categoryName(post.getCategoryName())
                .coverImageURL(post.getCoverImageURL())
                .likesCount(post.getLikesCount())
                .viewsCount(post.getViewsCount())
                .sharesCount(post.getSharesCount())
                .commentsCount(post.getCommentsCount())
                .commentsPreview(post.getCommentsPreview())
                .published(post.isPublished())
                .deleted(post.isDeleted())
                .createdDate(post.getCreatedDate())
                .updatedDate(post.getUpdatedDate())
                .publishedDate(post.getPublishedDate())
                .build();
    }
}