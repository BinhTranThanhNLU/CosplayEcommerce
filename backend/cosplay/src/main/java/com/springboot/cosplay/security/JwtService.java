package com.springboot.cosplay.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtService {

    private static final String TOKEN_PURPOSE_CLAIM = "purpose";
    private static final String RESET_PASSWORD_PURPOSE = "reset-password";

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpiration;

    // 1. Tạo token từ email
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    // 2. Lấy Email từ Token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 3. Kiểm tra Token còn hợp lệ không
    public boolean isTokenValid(String token, String userEmail) {
        final String email = extractEmail(token);
        return (email.equals(userEmail)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Tạo token từ email với thời gian hết hạn ngắn hơn (dành cho reset password)
    public String generateResetPasswordToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim(TOKEN_PURPOSE_CLAIM, RESET_PASSWORD_PURPOSE)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 phút
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isResetPasswordTokenValid(String token, String userEmail) {
        try {
            final String email = extractEmail(token);
            final String purpose = extractTokenPurpose(token);

            return email.equals(userEmail)
                    && RESET_PASSWORD_PURPOSE.equals(purpose)
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractTokenPurpose(String token) {
        return extractClaim(token, claims -> claims.get(TOKEN_PURPOSE_CLAIM, String.class));
    }
}