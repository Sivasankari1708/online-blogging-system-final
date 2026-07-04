package com.blog.engagementservice.controller;

import com.blog.engagementservice.dto.CreateReportRequest;
import com.blog.engagementservice.dto.ReportResponse;
import com.blog.engagementservice.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody CreateReportRequest request) {
        ReportResponse response = reportService.createReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ReportResponse>> getReportsByPostId(@PathVariable String postId) {
        List<ReportResponse> response = reportService.getReportsByPostId(postId);
        return ResponseEntity.ok(response);
    }
}
