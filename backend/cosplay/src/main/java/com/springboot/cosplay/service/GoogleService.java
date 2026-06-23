package com.springboot.cosplay.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.springboot.cosplay.dto.GoogleUserInfoDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleService {

    @Value("${app.google.client-id}")
    private String googleClientId;

    public GoogleUserInfoDTO verifyToken(String credential) {
        try {
            // Khởi tạo verifier giống hệt project Music
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // Xác minh token
            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                throw new RuntimeException("Google token không hợp lệ");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            // Map dữ liệu vào DTO
            return GoogleUserInfoDTO.builder()
                    .email(payload.getEmail())
                    .name((String) payload.get("name"))
                    .picture((String) payload.get("picture"))
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Xác thực Google thất bại: " + e.getMessage());
        }
    }
}