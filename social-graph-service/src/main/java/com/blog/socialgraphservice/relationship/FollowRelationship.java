package com.blog.socialgraphservice.relationship;

import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

@RelationshipProperties
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowRelationship {

    @Id
    @GeneratedValue
    private Long id;

    private String followedAt;

}
