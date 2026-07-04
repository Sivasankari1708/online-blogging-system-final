package com.blog.commentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotBlank(message = "Post ID is required")
    private String postId;

    @NotBlank(message = "Author ID is required")
    private String authorId;

    @NotBlank(message = "Author username is required")
    private String authorUsername;

    @NotBlank(message = "Content is required")
    @Size(max = 2000, message = "Comment must not exceed 2000 characters")
    private String content;

    /** Optional — if provided, this is a reply to that comment */
    private String parentCommentId;
}
