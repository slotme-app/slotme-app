package com.slotme.tenant;

import com.slotme.AbstractIntegrationTest;
import com.slotme.auth.dto.AuthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TenantIsolationTest extends AbstractIntegrationTest {

    @Test
    void tenantACannotSeeTenantBClients() throws Exception {
        // Register tenant A
        String uniqueA = UUID.randomUUID().toString().substring(0, 8);
        AuthResponse authA = registerUser("Tenant A " + uniqueA, "admin-a-" + uniqueA + "@test.com",
                "password123", "Admin", "A", "Salon A " + uniqueA);

        // Register tenant B
        String uniqueB = UUID.randomUUID().toString().substring(0, 8);
        AuthResponse authB = registerUser("Tenant B " + uniqueB, "admin-b-" + uniqueB + "@test.com",
                "password123", "Admin", "B", "Salon B " + uniqueB);

        // Create client in tenant A
        String phoneA = "+1" + String.format("%010d", (long)(Math.random() * 10000000000L));
        mockMvc.perform(post("/api/v1/salons/" + authA.user().salonId() + "/clients")
                        .header("Authorization", authHeader(authA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "first_name", "TenantA",
                                "last_name", "Client",
                                "phone", phoneA
                        ))))
                .andExpect(status().isCreated());

        // Tenant B lists their clients - should NOT see tenant A's client
        mockMvc.perform(get("/api/v1/salons/" + authB.user().salonId() + "/clients")
                        .header("Authorization", authHeader(authB)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)));

        // Tenant A lists their clients - should see their client
        mockMvc.perform(get("/api/v1/salons/" + authA.user().salonId() + "/clients")
                        .header("Authorization", authHeader(authA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].first_name").value("TenantA"));
    }

    @Test
    void tenantACannotAccessTenantBSalon() throws Exception {
        String uniqueA = UUID.randomUUID().toString().substring(0, 8);
        AuthResponse authA = registerUser("Iso A " + uniqueA, "iso-a-" + uniqueA + "@test.com",
                "password123", "Admin", "A", "Iso Salon A " + uniqueA);

        String uniqueB = UUID.randomUUID().toString().substring(0, 8);
        AuthResponse authB = registerUser("Iso B " + uniqueB, "iso-b-" + uniqueB + "@test.com",
                "password123", "Admin", "B", "Iso Salon B " + uniqueB);

        // Tenant A tries to access Tenant B's salon services - should return empty (RLS filters)
        mockMvc.perform(get("/api/v1/salons/" + authB.user().salonId() + "/services")
                        .header("Authorization", authHeader(authA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
