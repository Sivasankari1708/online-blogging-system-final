package com.blog.postservice.repository;

import com.blog.postservice.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    // Existing queries (preserved)
    List<Post> findByAuthorIdAndDeletedFalseOrderByCreatedDateDesc(String authorId);

    List<Post> findByPublishedTrueAndDeletedFalseOrderByPublishedDateDesc();

    // New: find by tag
    @Query("{ 'tags': ?0, 'published': true, 'deleted': false }")
    List<Post> findByTagAndPublishedTrueAndDeletedFalse(String tag);

    // New: keyword search on title or content (case-insensitive)
    @Query("{ '$or': [ { 'title': { '$regex': ?0, '$options': 'i' } }, { 'content': { '$regex': ?0, '$options': 'i' } } ], 'published': true, 'deleted': false }")
    List<Post> searchPublishedByKeyword(String keyword);

    // New: find all draft (unpublished) posts by author
    @Query("{ 'authorId': ?0, 'published': false, 'deleted': false }")
    List<Post> findDraftsByAuthorId(String authorId);
}