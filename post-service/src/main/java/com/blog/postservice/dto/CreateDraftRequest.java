package com.blog.postservice.dto;

import com.blog.postservice.model.Media;
import lombok.Data;

import java.util.List;

@Data
public class CreateDraftRequest {
    private String authorId;
    private String title;
    private String content;
    private String excerpt;
    private List<Media> media;
    private List<String> tags;
    private String categoryName;
    private String coverImageURL;
}