package com.blog.engagementservice.dto;

import com.blog.engagementservice.model.Report.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private String id;
    private String reporterId;
    private String reportedPostId;
    private ReportReason reason;
    private String additionalDetails;
    private Instant createdAt;
}
