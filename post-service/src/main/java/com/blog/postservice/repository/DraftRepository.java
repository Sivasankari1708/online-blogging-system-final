package com.blog.postservice.repository;

import com.blog.postservice.model.Draft;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DraftRepository extends MongoRepository<Draft, String> {

    List<Draft> findByAuthorIdOrderByLastSavedAtDesc(String authorId);
}