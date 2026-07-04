package com.blog.postservice.service;

import com.blog.postservice.dto.CreateTagRequest;
import com.blog.postservice.dto.TagResponse;
import com.blog.postservice.model.Tag;
import com.blog.postservice.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public TagResponse createTag(CreateTagRequest request) {
        String cleanedName = request.getName().trim().toLowerCase();

        if (tagRepository.findByNameIgnoreCase(cleanedName).isPresent()) {
            throw new RuntimeException("Tag already exists");
        }

        Tag tag = Tag.builder()
                .name(cleanedName)
                .usageCount(0)
                .build();

        Tag saved = tagRepository.save(tag);
        return mapToResponse(saved);
    }

    @Override
    public List<TagResponse> getAllTags() {
        return tagRepository.findAllByOrderByUsageCountDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TagResponse getTagByName(String name) {
        Tag tag = tagRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        return mapToResponse(tag);
    }

    private TagResponse mapToResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .usageCount(tag.getUsageCount())
                .build();
    }
}