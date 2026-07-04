package com.blog.authservice.controller;

import com.blog.authservice.dto.AuthResponse;
import com.blog.authservice.dto.LoginRequest;
import com.blog.authservice.dto.RegisterRequest;
import com.blog.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Authentication REST Controller.
 *
 * POST /auth/register  — Register a new user, returns JWT token
 * POST /auth/login     — Login with email + password, returns JWT token
 * POST /auth/logout    — Stateless logout (client deletes token)
 *
 * All endpoints are public (no auth required).
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Register a new user account.
     *
     * @param request username, email, password
     * @return 201 Created with JWT token and user info
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login with email and password.
     *
     * @param request email, password
     * @return 200 OK with JWT token and user info
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout the current user.
     * Since JWT is stateless, logout is handled on the client side
     * by deleting the stored token. This endpoint exists for completeness.
     *
     * @return 200 OK with confirmation message
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully. Please delete your token on the client side."
        ));
    }
}
