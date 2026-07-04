package com.blog.engagementservice.repository;

import com.blog.engagementservice.model.Report;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {

    List<Report> findByReportedPostId(String reportedPostId);

    List<Report> findByReporterId(String reporterId);
    
    boolean existsByReporterIdAndReportedPostId(String reporterId, String reportedPostId);
}
