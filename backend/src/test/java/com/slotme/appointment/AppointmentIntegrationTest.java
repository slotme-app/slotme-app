package com.slotme.appointment;

import com.slotme.AbstractIntegrationTest;
import com.slotme.auth.dto.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AppointmentIntegrationTest extends AbstractIntegrationTest {

    private AuthResponse auth;
    private String salonId;
    private String tenantId;

    @BeforeEach
    void setUp() throws Exception {
        String unique = UUID.randomUUID().toString().substring(0, 8);
        auth = registerUser("Appt Corp " + unique, "appt-" + unique + "@test.com",
                "password123", "Admin", "User", "Appt Salon " + unique);
        salonId = auth.user().salonId();
        tenantId = auth.user().tenantId();
    }

    @Test
    void createAndListAppointments() throws Exception {
        // Create a service
        String serviceId = createService();

        // Create a master
        String masterId = createMaster();

        // Create a client
        String clientId = createClient();

        // Create appointment
        Instant startAt = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.SECONDS);

        mockMvc.perform(post("/api/v1/appointments")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "salon_id", salonId,
                                "master_id", masterId,
                                "service_id", serviceId,
                                "client_id", clientId,
                                "start_at", startAt.toString(),
                                "notes", "Test appointment"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("confirmed"))
                .andExpect(jsonPath("$.notes").value("Test appointment"));

        // List appointments
        mockMvc.perform(get("/api/v1/appointments")
                        .header("Authorization", authHeader(auth))
                        .param("salon_id", salonId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void cancelAppointment() throws Exception {
        String serviceId = createService();
        String masterId = createMaster();
        String clientId = createClient();
        Instant startAt = Instant.now().plus(3, ChronoUnit.DAYS).truncatedTo(ChronoUnit.SECONDS);

        MvcResult result = mockMvc.perform(post("/api/v1/appointments")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "salon_id", salonId,
                                "master_id", masterId,
                                "service_id", serviceId,
                                "client_id", clientId,
                                "start_at", startAt.toString()
                        ))))
                .andExpect(status().isCreated())
                .andReturn();

        String appointmentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        // Cancel
        mockMvc.perform(post("/api/v1/appointments/" + appointmentId + "/cancel")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"reason": "Client requested cancellation"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", containsString("cancelled")));
    }

    @Test
    void conflictDetectionPreventsDoubleBooking() throws Exception {
        String serviceId = createService();
        String masterId = createMaster();
        String clientId = createClient();
        Instant startAt = Instant.now().plus(4, ChronoUnit.DAYS).truncatedTo(ChronoUnit.SECONDS);

        // First booking succeeds
        mockMvc.perform(post("/api/v1/appointments")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "salon_id", salonId,
                                "master_id", masterId,
                                "service_id", serviceId,
                                "client_id", clientId,
                                "start_at", startAt.toString()
                        ))))
                .andExpect(status().isCreated());

        // Second booking at same time should fail
        String clientId2 = createClient();
        mockMvc.perform(post("/api/v1/appointments")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "salon_id", salonId,
                                "master_id", masterId,
                                "service_id", serviceId,
                                "client_id", clientId2,
                                "start_at", startAt.toString()
                        ))))
                .andExpect(status().isConflict());
    }

    private String createService() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/salons/" + salonId + "/services")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Haircut " + UUID.randomUUID().toString().substring(0, 4),
                                "duration_minutes", 60,
                                "price", 50.00,
                                "currency", "USD"
                        ))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
    }

    private String createMaster() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/salons/" + salonId + "/masters")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "master-" + UUID.randomUUID().toString().substring(0, 8) + "@test.com",
                                "display_name", "Test Master",
                                "password", "password123",
                                "first_name", "Master",
                                "last_name", "Test"
                        ))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
    }

    private String createClient() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/salons/" + salonId + "/clients")
                        .header("Authorization", authHeader(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "first_name", "Client",
                                "last_name", "Test",
                                "phone", "+1" + String.format("%010d", (long)(Math.random() * 10000000000L))
                        ))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
    }
}
