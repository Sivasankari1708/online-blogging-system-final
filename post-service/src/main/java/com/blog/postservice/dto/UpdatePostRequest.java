package com.blog.postservice.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/**
 * Request body for updating an existing post.
 * All fields are optional — only non-null fields will be updated.
 */
@Data
public class UpdatePostRequest {

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String content;

    @Size(max = 500, message = "Excerpt must not exceed 500 characters")
    private String excerpt;

    private List<String> tags;

    private String categoryName;

    private String coverImageURL;
}
