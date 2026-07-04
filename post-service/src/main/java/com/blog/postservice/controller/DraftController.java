package com.blog.postservice.controller;

import com.blog.postservice.dto.CreateDraftRequest;
import com.blog.postservice.dto.DraftResponse;
import com.blog.postservice.dto.UpdateDraftRequest;
import com.blog.postservice.service.DraftService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drafts")
@RequiredArgsConstructor
public class DraftController {

    private final DraftService draftService;

    @PostMapping
    public DraftResponse createDraft(@RequestBody CreateDraftRequest request) {
        return draftService.createDraft(request);
    }

    @GetMapping("/{draftId}")
    public DraftResponse getDraftById(@PathVariable String draftId) {
        return draftService.getDraftById(draftId);
    }

    @GetMapping("/author/{authorId}")
    public List<DraftResponse> getDraftsByAuthor(@PathVariable String authorId) {
        return draftService.getDraftsByAuthor(authorId);
    }

    @PutMapping("/{draftId}")
    public DraftResponse updateDraft(@PathVariable String draftId,
                                     @RequestBody UpdateDraftRequest request) {
        return draftService.updateDraft(draftId, request);
    }

    @DeleteMapping("/{draftId}")
    public void deleteDraft(@PathVariable String draftId) {
        draftService.deleteDraft(draftId);
    }
}