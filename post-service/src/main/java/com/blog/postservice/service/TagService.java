package com.blog.postservice.service;

import com.blog.postservice.dto.CreateTagRequest;
import com.blog.postservice.dto.TagResponse;

import java.util.List;

public interface TagService {

    TagResponse createTag(CreateTagRequest request);

    List<TagResponse> getAllTags();

    TagResponse getTagByName(String name);
}