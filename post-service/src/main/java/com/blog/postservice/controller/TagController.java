package com.blog.postservice.controller;

import com.blog.postservice.dto.CreateTagRequest;
import com.blog.postservice.dto.TagResponse;
import com.blog.postservice.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    public TagResponse createTag(@RequestBody CreateTagRequest request) {
        return tagService.createTag(request);
    }

    @GetMapping
    public List<TagResponse> getAllTags() {
        return tagService.getAllTags();
    }

    @GetMapping("/name/{name}")
    public TagResponse getTagByName(@PathVariable String name) {
        return tagService.getTagByName(name);
    }
}