package com.blog.postservice.service;

import com.blog.postservice.dto.CreateDraftRequest;
import com.blog.postservice.dto.DraftResponse;
import com.blog.postservice.dto.UpdateDraftRequest;

import java.util.List;

public interface DraftService {

    DraftResponse createDraft(CreateDraftRequest request);

    DraftResponse getDraftById(String draftId);

    List<DraftResponse> getDraftsByAuthor(String authorId);

    DraftResponse updateDraft(String draftId, UpdateDraftRequest request);

    void deleteDraft(String draftId);
}