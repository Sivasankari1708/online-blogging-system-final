package com.blog.apigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.List;
import java.util.function.Predicate;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Value("${jwt.secret:defaultSecretKeyWithAtLeast256BitsLengthForHmacSha256Algorithm}")
    private String jwtSecret;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();
            HttpMethod method = request.getMethod();

            // Define endpoints that are always public (bypass auth completely)
            final List<String> apiEndpoints = List.of(
                    "/auth/register",
                    "/auth/login"
            );

            Predicate<ServerHttpRequest> isApiSecured = r -> apiEndpoints.stream()
                    .noneMatch(uri -> r.getURI().getPath().contains(uri));

            // Define paths where GET requests are public (reading posts, comments, profiles)
            final List<String> publicGetPaths = List.of(
                    "/posts",
                    "/comments",
                    "/users/profiles",
                    "/users/search",
                    "/social/followers",
                    "/social/following"
            );

            boolean isPublicGet = method == HttpMethod.GET && publicGetPaths.stream()
                    .anyMatch(uri -> path.startsWith(uri));

            if (isApiSecured.test(request) && !isPublicGet) {
                if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
                }

                String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return onError(exchange, "Invalid authorization header format", HttpStatus.UNAUTHORIZED);
                }

                String token = authHeader.substring(7);

                try {
                    SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
                    Claims claims = Jwts.parser()
                            .verifyWith(key)
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

                    String userId = claims.getSubject();
                    String username = claims.get("username", String.class);

                    // Add the user ID and username to the request headers for downstream services
                    request = exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .header("X-User-Name", username)
                            .build();

                } catch (Exception e) {
                    return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
                }
            }

            // If it's a public GET but they provided a token, we could optionally extract it
            // but for simplicity we'll just let it pass through.
            
            return chain.filter(exchange.mutate().request(request).build());
        };
    }

    private reactor.core.publisher.Mono<Void> onError(org.springframework.web.server.ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        org.springframework.http.server.reactive.ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    public static class Config {
    }
}
