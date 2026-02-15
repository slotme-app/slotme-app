package com.slotme.auth;

import com.slotme.AbstractIntegrationTest;
import com.slotme.auth.dto.AuthResponse;
import com.slotme.auth.dto.RefreshRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthIntegrationTest extends AbstractIntegrationTest {

    @Test
    void registerCreatesUserAndReturnTokens() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "tenantName": "Test Salon Corp",
                                "email": "owner@testsalon.com",
                                "password": "securePassword123",
                                "firstName": "John",
                                "lastName": "Doe",
                                "salonName": "Test Salon",
                                "timezone": "America/New_York"
                            }
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.access_token").isNotEmpty())
                .andExpect(jsonPath("$.refresh_token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("owner@testsalon.com"))
                .andExpect(jsonPath("$.user.role").value("SALON_ADMIN"))
                .andExpect(jsonPath("$.user.tenant_id").isNotEmpty())
                .andExpect(jsonPath("$.user.salon_id").isNotEmpty());
    }

    @Test
    void registerDuplicateTenantReturnsConflict() throws Exception {
        registerUser("Duplicate Corp", "first@dup.com", "password123", "A", "B", "Dup Salon");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "tenantName": "Duplicate Corp",
                                "email": "second@dup.com",
                                "password": "password123",
                                "firstName": "C",
                                "lastName": "D",
                                "salonName": "Another Salon"
                            }
                        """))
                .andExpect(status().isConflict());
    }

    @Test
    void loginWithValidCredentials() throws Exception {
        registerUser("Login Test Corp", "login@test.com", "password123", "Test", "User", "Login Salon");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "email": "login@test.com",
                                "password": "password123"
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("login@test.com"));
    }

    @Test
    void loginWithInvalidPasswordReturnsUnauthorized() throws Exception {
        registerUser("Bad Login Corp", "badlogin@test.com", "password123", "Test", "User", "Bad Salon");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "email": "badlogin@test.com",
                                "password": "wrongpassword"
                            }
                        """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshTokenReturnsNewTokens() throws Exception {
        AuthResponse auth = registerUser("Refresh Corp", "refresh@test.com", "password123",
                "Test", "User", "Refresh Salon");

        RefreshRequest refreshReq = new RefreshRequest(auth.refreshToken());

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").isNotEmpty())
                .andExpect(jsonPath("$.refresh_token").isNotEmpty());
    }

    @Test
    void getCurrentUserWithValidToken() throws Exception {
        AuthResponse auth = registerUser("Profile Corp", "profile@test.com", "password123",
                "Jane", "Smith", "Profile Salon");

        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("profile@test.com"))
                .andExpect(jsonPath("$.first_name").value("Jane"))
                .andExpect(jsonPath("$.last_name").value("Smith"));
    }

    @Test
    void accessProtectedEndpointWithoutTokenReturns403() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isForbidden());
    }
}
