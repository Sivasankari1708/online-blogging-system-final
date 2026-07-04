package com.blog.postservice.service;

import com.blog.postservice.dto.CreateDraftRequest;
import com.blog.postservice.dto.DraftResponse;
import com.blog.postservice.dto.UpdateDraftRequest;
import com.blog.postservice.model.Draft;
import com.blog.postservice.repository.DraftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DraftServiceImpl implements DraftService {

    private final DraftRepository draftRepository;

    @Override
    public DraftResponse createDraft(CreateDraftRequest request) {
        Instant now = Instant.now();

        Draft draft = Draft.builder()
                .authorId(request.getAuthorId())
                .title(request.getTitle())
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .media(request.getMedia())
                .tags(request.getTags())
                .categoryName(request.getCategoryName())
                .coverImageURL(request.getCoverImageURL())
                .createdAt(now)
                .lastSavedAt(now)
                .build();

        Draft saved = draftRepository.save(draft);
        return mapToResponse(saved);
    }

    @Override
    public DraftResponse getDraftById(String draftId) {
        Draft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new RuntimeException("Draft not found"));

        return mapToResponse(draft);
    }

    @Override
    public List<DraftResponse> getDraftsByAuthor(String authorId) {
        return draftRepository.findByAuthorIdOrderByLastSavedAtDesc(authorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DraftResponse updateDraft(String draftId, UpdateDraftRequest request) {
        Draft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new RuntimeException("Draft not found"));

        draft.setTitle(request.getTitle());
        draft.setContent(request.getContent());
        draft.setExcerpt(request.getExcerpt());
        draft.setMedia(request.getMedia());
        draft.setTags(request.getTags());
        draft.setCategoryName(request.getCategoryName());
        draft.setCoverImageURL(request.getCoverImageURL());
        draft.setLastSavedAt(Instant.now());

        Draft updated = draftRepository.save(draft);
        return mapToResponse(updated);
    }

    @Override
    public void deleteDraft(String draftId) {
        if (!draftRepository.existsById(draftId)) {
            throw new RuntimeException("Draft not found");
        }
        draftRepository.deleteById(draftId);
    }

    private DraftResponse mapToResponse(Draft draft) {
        return DraftResponse.builder()
                .id(draft.getId())
                .authorId(draft.getAuthorId())
                .title(draft.getTitle())
                .content(draft.getContent())
                .excerpt(draft.getExcerpt())
                .media(draft.getMedia())
                .tags(draft.getTags())
                .categoryName(draft.getCategoryName())
                .coverImageURL(draft.getCoverImageURL())
                .createdAt(draft.getCreatedAt())
                .lastSavedAt(draft.getLastSavedAt())
                .build();
    }
}