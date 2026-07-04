package com.blog.commentservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class CommentResponse {

    private String id;
    private String postId;
    private String authorId;
    private String authorUsername;
    private String content;
    private String parentCommentId;
    private List<String> replies;
    private boolean deleted;
    private Instant createdAt;
    private Instant updatedAt;
}
