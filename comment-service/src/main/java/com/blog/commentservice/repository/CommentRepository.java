package com.blog.commentservice.repository;

import com.blog.commentservice.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    /** Top-level comments only (no replies) */
    List<Comment> findByPostIdAndParentCommentIdIsNullAndDeletedFalseOrderByCreatedAtDesc(String postId);

    /** Replies to a specific comment */
    List<Comment> findByParentCommentIdAndDeletedFalseOrderByCreatedAtAsc(String parentCommentId);

    /** All comments by a specific author */
    List<Comment> findByAuthorIdAndDeletedFalseOrderByCreatedAtDesc(String authorId);

    /** Count non-deleted comments for a post */
    long countByPostIdAndDeletedFalse(String postId);
}
