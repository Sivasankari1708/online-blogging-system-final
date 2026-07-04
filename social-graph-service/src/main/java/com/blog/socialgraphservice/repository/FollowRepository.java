package com.blog.socialgraphservice.repository;
import com.blog.socialgraphservice.node.UserNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FollowRepository extends Neo4jRepository<UserNode, String> {

    // Create follow relationship
    @Query("""
    MERGE (follower:User {userId: $followerId})
    MERGE (following:User {userId: $followingId})
    MERGE (follower)-[:FOLLOWS]->(following)
    """)
    void followUser(@Param("followerId") String followerId,
                    @Param("followingId") String followingId);

    // Check if following
    @Query("""
    RETURN EXISTS((:User {userId: $followerId})-[:FOLLOWS]->(:User {userId: $followingId}))
    """)
    boolean isFollowing(@Param("followerId") String followerId, 
                        @Param("followingId") String followingId);

    // Remove follow relationship
    @Query("""
    MATCH (follower:User {userId:$followerId})-[r:FOLLOWS]->(following:User {userId:$followingId})
    DELETE r
    """)
    void unfollowUser(@Param("followerId") String followerId,
                      @Param("followingId") String followingId);


    // Get followers
    @Query("""
    MATCH (u:User {userId: $userId})<-[:FOLLOWS]-(follower)
    RETURN follower
    """)
    List<UserNode> getFollowers(@Param("userId") String userId);


    // Get following
    @Query("""
    MATCH (u:User {userId: $userId})-[:FOLLOWS]->(following)
    RETURN following
    """)
    List<UserNode> getFollowing(@Param("userId") String userId);


    // Count followers
    @Query("""
    MATCH (u:User {userId: $userId})<-[:FOLLOWS]-(follower:User)
    RETURN count(follower)
    """)
    Long countFollowers(@Param("userId") String userId);


    // Count following
    @Query("""
    MATCH (u:User {userId: $userId})-[:FOLLOWS]->(following:User)
    RETURN count(following)
    """)
    Long countFollowing(@Param("userId") String userId);
}
