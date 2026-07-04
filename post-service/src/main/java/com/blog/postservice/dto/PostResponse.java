package com.blog.postservice.dto;

import com.blog.postservice.model.CommentPreview;
import com.blog.postservice.model.Media;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class PostResponse {
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