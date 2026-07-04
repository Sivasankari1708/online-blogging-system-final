package com.blog.userservice.repository;

import com.blog.userservice.model.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends MongoRepository<UserProfile, String> {

    Optional<UserProfile> findByUserId(String userId);

    Optional<UserProfile> findByUsername(String username);

    boolean existsByUserId(String userId);

    boolean existsByUsername(String username);

    /**
     * Search users by username or displayName (case-insensitive contains).
     */
    @Query("{ '$or': [ { 'username': { '$regex': ?0, '$options': 'i' } }, { 'displayName': { '$regex': ?0, '$options': 'i' } } ] }")
    List<UserProfile> searchByUsernameOrDisplayName(String query);
}
