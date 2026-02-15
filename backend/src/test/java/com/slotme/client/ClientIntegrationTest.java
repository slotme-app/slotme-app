package com.slotme.client;

import com.slotme.AbstractIntegrationTest;
import com.slotme.auth.dto.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ClientIntegrationTest extends AbstractIntegrationTest {

    private AuthResponse auth;
    private String salonId;

    @BeforeEach
    void setUp() throws Exception {
        String unique = UUID.randomUUID().toString().substring(0, 8);
        auth = registerUser("Client Corp " + unique, "client-admin-" + unique + "@test.com",
                "password123", "Admin", "User", "Client Salon " + unique);
        salonId = auth.user().salonId();
    }

    @Test
    void createAndGetClient() throws Exception {
        String phone = "+1" + String.format("%010d", (long)(Math.random() * 10000000000L));

        MvcResult result = mockMvc.perform(post("/api/v1/salons/" + salonId + "/clients")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "first_name", "Alice",
                                "last_name", "Wonderland",
                                "phone", phone,
                                "email", "alice@example.com"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.first_name").value("Alice"))
                .andExpect(jsonPath("$.phone").value(phone))
                .andReturn();

        String clientId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        // Get client
        mockMvc.perform(get("/api/v1/salons/" + salonId + "/clients/" + clientId)
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.first_name").value("Alice"));
    }

    @Test
    void searchClients() throws Exception {
        String phone = "+1" + String.format("%010d", (long)(Math.random() * 10000000000L));
        mockMvc.perform(post("/api/v1/salons/" + salonId + "/clients")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "first_name", "Searchable",
                                "last_name", "Person",
                                "phone", phone
                        ))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/salons/" + salonId + "/clients")
                        .header("Authorization", authHeader(auth))
                        .param("query", "Searchable"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].first_name").value("Searchable"));
    }

    @Test
    void clientNotesCrud() throws Exception {
        String clientId = createClient();

        // Add note
        MvcResult noteResult = mockMvc.perform(post("/api/v1/salons/" + salonId + "/clients/" + clientId + "/notes")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"content": "Client prefers morning appointments"}
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("Client prefers morning appointments"))
                .andReturn();

        String noteId = objectMapper.readTree(noteResult.getResponse().getContentAsString()).get("id").asText();

        // List notes
        mockMvc.perform(get("/api/v1/salons/" + salonId + "/clients/" + clientId + "/notes")
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        // Update note
        mockMvc.perform(put("/api/v1/salons/" + salonId + "/clients/" + clientId + "/notes/" + noteId)
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"content": "Updated: prefers evening appointments"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated: prefers evening appointments"));

        // Delete note
        mockMvc.perform(delete("/api/v1/salons/" + salonId + "/clients/" + clientId + "/notes/" + noteId)
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isNoContent());
    }

    @Test
    void gdprDataExport() throws Exception {
        String clientId = createClient();

        mockMvc.perform(get("/api/v1/salons/" + salonId + "/clients/" + clientId + "/data-export")
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.personal_data.id").value(clientId))
                .andExpect(jsonPath("$.appointments").isArray())
                .andExpect(jsonPath("$.notes").isArray())
                .andExpect(jsonPath("$.export_date").isNotEmpty());
    }

    @Test
    void gdprDelete() throws Exception {
        String clientId = createClient();

        mockMvc.perform(delete("/api/v1/salons/" + salonId + "/clients/" + clientId + "/gdpr-delete")
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isNoContent());

        // Verify data is anonymized
        mockMvc.perform(get("/api/v1/salons/" + salonId + "/clients/" + clientId)
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.first_name").value("DELETED"))
                .andExpect(jsonPath("$.phone").value("0000000000"));
    }

    @Test
    void enrichedProfile() throws Exception {
        String clientId = createClient();

        mockMvc.perform(get("/api/v1/salons/" + salonId + "/clients/" + clientId + "/profile")
                        .header("Authorization", authHeader(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(clientId))
                .andExpect(jsonPath("$.total_visits").value(0))
                .andExpect(jsonPath("$.total_spent").value(0));
    }

    private String createClient() throws Exception {
        String phone = "+1" + String.format("%010d", (long)(Math.random() * 10000000000L));
        MvcResult result = mockMvc.perform(post("/api/v1/salons/" + salonId + "/clients")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "first_name", "Test",
                                "last_name", "Client",
                                "phone", phone
                        ))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
    }
}
