package com.blog.engagementservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {

    @Id
    private String id;

    private String reporterId;

    private String reportedPostId;

    private ReportReason reason;

    private String additionalDetails;

    private Instant createdAt;

    public enum ReportReason {
        SPAM,
        HARASSMENT,
        FAKE_INFORMATION,
        VIOLENCE,
        OTHER
    }
}
