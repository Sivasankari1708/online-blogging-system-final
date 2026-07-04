package com.blog.engagementservice.repository;

import com.blog.engagementservice.model.Bookmark;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends MongoRepository<Bookmark, String> {

    Optional<Bookmark> findByUserIdAndPostId(String userId, String postId);

    boolean existsByUserIdAndPostId(String userId, String postId);

    void deleteByUserIdAndPostId(String userId, String postId);

    List<Bookmark> findByUserIdOrderBySavedAtDesc(String userId);
}