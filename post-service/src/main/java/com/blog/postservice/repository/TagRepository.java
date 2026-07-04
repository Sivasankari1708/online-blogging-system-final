package com.blog.postservice.repository;

import com.blog.postservice.model.Tag;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends MongoRepository<Tag, String> {

    Optional<Tag> findByNameIgnoreCase(String name);

    List<Tag> findAllByOrderByUsageCountDesc();
}