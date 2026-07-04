package com.blog.engagementservice.service;

import com.blog.engagementservice.dto.CreateReportRequest;
import com.blog.engagementservice.dto.ReportResponse;
import com.blog.engagementservice.model.Report;
import com.blog.engagementservice.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    @Override
    public ReportResponse createReport(CreateReportRequest request) {

        if (reportRepository.existsByReporterIdAndReportedPostId(request.getReporterId(), request.getReportedPostId())) {
            throw new RuntimeException("You have already reported this post");
        }

        Report report = Report.builder()
                .reporterId(request.getReporterId())
                .reportedPostId(request.getReportedPostId())
                .reason(request.getReason())
                .additionalDetails(request.getAdditionalDetails())
                .createdAt(Instant.now())
                .build();

        Report saved = reportRepository.save(report);
        return mapToResponse(saved);
    }

    @Override
    public List<ReportResponse> getReportsByPostId(String postId) {
        return reportRepository.findByReportedPostId(postId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReportResponse mapToResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporterId())
                .reportedPostId(report.getReportedPostId())
                .reason(report.getReason())
                .additionalDetails(report.getAdditionalDetails())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
