package com.blog.engagementservice.service;

import com.blog.engagementservice.dto.CreateReportRequest;
import com.blog.engagementservice.dto.ReportResponse;

import java.util.List;

public interface ReportService {

    ReportResponse createReport(CreateReportRequest request);

    List<ReportResponse> getReportsByPostId(String postId);
}
