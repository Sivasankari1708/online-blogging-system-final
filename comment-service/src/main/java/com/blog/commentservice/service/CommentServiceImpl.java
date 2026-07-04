package com.blog.commentservice.service;

import com.blog.commentservice.dto.CommentResponse;
import com.blog.commentservice.dto.CreateCommentRequest;
import com.blog.commentservice.dto.UpdateCommentRequest;
import com.blog.commentservice.model.Comment;
import com.blog.commentservice.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Override
    public CommentResponse addComment(CreateCommentRequest request) {
        Instant now = Instant.now();

        Comment comment = Comment.builder()
                .postId(request.getPostId())
                .authorId(request.getAuthorId())
                .authorUsername(request.getAuthorUsername())
                .content(request.getContent())
                .parentCommentId(request.getParentCommentId())
                .replies(new ArrayList<>())
                .deleted(false)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Comment saved = commentRepository.save(comment);

        // If this is a reply, we need to update the parent comment's replies list
        if (request.getParentCommentId() != null) {
            commentRepository.findById(request.getParentCommentId()).ifPresent(parent -> {
                if (parent.getReplies() == null) {
                    parent.setReplies(new ArrayList<>());
                }
                parent.getReplies().add(saved.getId());
                commentRepository.save(parent);
            });
        }

        return mapToResponse(saved);
    }

    @Override
    public CommentResponse updateComment(String commentId, String authorId, UpdateCommentRequest request) {
        Comment comment = getCommentAndVerifyOwnership(commentId, authorId);
        
        comment.setContent(request.getContent());
        comment.setUpdatedAt(Instant.now());
        
        Comment updated = commentRepository.save(comment);
        return mapToResponse(updated);
    }

    @Override
    public void deleteComment(String commentId, String authorId) {
        Comment comment = getCommentAndVerifyOwnership(commentId, authorId);
        
        // Soft delete
        comment.setDeleted(true);
        comment.setUpdatedAt(Instant.now());
        commentRepository.save(comment);
    }

    @Override
    public CommentResponse getCommentById(String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return mapToResponse(comment);
    }

    @Override
    public List<CommentResponse> getCommentsByPostId(String postId) {
        return commentRepository.findByPostIdAndParentCommentIdIsNullAndDeletedFalseOrderByCreatedAtDesc(postId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CommentResponse> getReplies(String parentCommentId) {
        return commentRepository.findByParentCommentIdAndDeletedFalseOrderByCreatedAtAsc(parentCommentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CommentResponse> getCommentsByAuthor(String authorId) {
        return commentRepository.findByAuthorIdAndDeletedFalseOrderByCreatedAtDesc(authorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public long getCommentCountForPost(String postId) {
        return commentRepository.countByPostIdAndDeletedFalse(postId);
    }

    private Comment getCommentAndVerifyOwnership(String commentId, String authorId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (comment.isDeleted()) {
            throw new RuntimeException("Comment has been deleted");
        }
        if (!comment.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to modify this comment");
        }
        return comment;
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .authorId(comment.getAuthorId())
                .authorUsername(comment.getAuthorUsername())
                .content(comment.getContent())
                .parentCommentId(comment.getParentCommentId())
                .replies(comment.getReplies())
                .deleted(comment.isDeleted())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
