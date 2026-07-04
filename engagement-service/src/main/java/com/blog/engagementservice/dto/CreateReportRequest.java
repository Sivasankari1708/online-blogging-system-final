package com.blog.engagementservice.dto;

import com.blog.engagementservice.model.Report.ReportReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {

    @NotBlank(message = "Reporter ID is required")
    private String reporterId;

    @NotBlank(message = "Reported Post ID is required")
    private String reportedPostId;

    @NotNull(message = "Reason is required")
    private ReportReason reason;

    private String additionalDetails;
}
