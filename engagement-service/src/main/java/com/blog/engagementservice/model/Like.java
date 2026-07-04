package com.blog.engagementservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "likes")
public class Like {

    @Id
    private String id;

    private String userId;
    private String postId;
    private Instant createdAt;
}