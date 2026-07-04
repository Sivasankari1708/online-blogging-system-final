package com.blog.postservice.dto;

import com.blog.postservice.model.Media;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@Data
public class CreatePostRequest {
    private String authorId; // Ignored internally but kept for compatibility
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String excerpt;
    private List<Media> media;
    private List<String> tags;
    private String categoryName;
    private String coverImageURL;
    private boolean published;
}