package com.blog.postservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String authorId;
    private String authorName;
    private String title;
    private String content;
    private String excerpt;

    private List<Media> media;
    private List<String> tags;
    private String categoryName;
    private String coverImageURL;

    private int likesCount;
    private int viewsCount;
    private int sharesCount;
    private int commentsCount;

    private List<CommentPreview> commentsPreview;

    private boolean published;
    private boolean deleted;

    private Instant createdDate;
    private Instant updatedDate;
    private Instant publishedDate;
}