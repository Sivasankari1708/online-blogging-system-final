package com.blog.postservice.dto;

import com.blog.postservice.model.Media;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class DraftResponse {
    private String id;
    private String authorId;
    private String title;
    private String content;
    private String excerpt;
    private List<Media> media;
    private List<String> tags;
    private String categoryName;
    private String coverImageURL;
    private Instant createdAt;
    private Instant lastSavedAt;
}