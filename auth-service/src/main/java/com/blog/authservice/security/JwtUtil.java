package com.blog.authservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a signed JWT token.
     * Subject = userId (used as the principal in SecurityContext).
     * Claims also carry username and email for convenience.
     */
    public String generateToken(String userId, String username, String email) {
        return Jwts.builder()
                .subject(userId)
                .claim("username", username)
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract userId (subject) from token.
     */
    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Extract username claim from token.
     */
    public String extractUsername(String token) {
        return getClaims(token).get("username", String.class);
    }

    /**
     * Extract email claim from token.
     */
    public String extractEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    /**
     * Validate token signature and expiry. Returns false on any error.
     */
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
