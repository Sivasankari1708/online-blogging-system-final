package com.blog.commentservice.service;

import com.blog.commentservice.dto.CommentResponse;
import com.blog.commentservice.dto.CreateCommentRequest;
import com.blog.commentservice.dto.UpdateCommentRequest;

import java.util.List;

public interface CommentService {

    CommentResponse addComment(CreateCommentRequest request);

    CommentResponse updateComment(String commentId, String authorId, UpdateCommentRequest request);

    void deleteComment(String commentId, String authorId);

    CommentResponse getCommentById(String commentId);

    List<CommentResponse> getCommentsByPostId(String postId);

    List<CommentResponse> getReplies(String parentCommentId);

    List<CommentResponse> getCommentsByAuthor(String authorId);

    long getCommentCountForPost(String postId);
}
