package com.blog.authservice.service;

import com.blog.authservice.dto.AuthResponse;
import com.blog.authservice.dto.LoginRequest;
import com.blog.authservice.dto.RegisterRequest;
import com.blog.authservice.exception.DuplicateEmailException;
import com.blog.authservice.exception.DuplicateUsernameException;
import com.blog.authservice.exception.InvalidCredentialsException;
import com.blog.authservice.model.User;
import com.blog.authservice.repository.UserRepository;
import com.blog.authservice.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUsernameException("Username is already taken");
        }

        Instant now = Instant.now();

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .createdAt(now)
                .updatedAt(now)
                .build();

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail()
        );

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
