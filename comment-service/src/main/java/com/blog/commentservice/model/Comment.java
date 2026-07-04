package com.blog.commentservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String authorId;

    private String authorUsername;

    private String content;

    /** null means top-level comment; non-null means this is a reply */
    private String parentCommentId;

    @Builder.Default
    private List<String> replies = new ArrayList<>();

    @Builder.Default
    private boolean deleted = false;

    private Instant createdAt;
    private Instant updatedAt;
}
