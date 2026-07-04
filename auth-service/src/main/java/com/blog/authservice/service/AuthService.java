package com.blog.authservice.service;

import com.blog.authservice.dto.AuthResponse;
import com.blog.authservice.dto.LoginRequest;
import com.blog.authservice.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
