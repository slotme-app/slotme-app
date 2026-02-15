package com.slotme.webhook;

import com.slotme.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class WhatsAppWebhookTest extends AbstractIntegrationTest {

    @Test
    void webhookVerificationWithCorrectToken() throws Exception {
        mockMvc.perform(get("/api/v1/webhooks/whatsapp")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", "test-verify")
                        .param("hub.challenge", "challenge_12345"))
                .andExpect(status().isOk())
                .andExpect(content().string("challenge_12345"));
    }

    @Test
    void webhookVerificationWithWrongToken() throws Exception {
        mockMvc.perform(get("/api/v1/webhooks/whatsapp")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", "wrong-token")
                        .param("hub.challenge", "challenge_12345"))
                .andExpect(status().isForbidden());
    }

    @Test
    void webhookPostWithoutSignatureReturnsUnauthorized() throws Exception {
        // Without a valid HMAC signature, the webhook rejects the request
        mockMvc.perform(post("/api/v1/webhooks/whatsapp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "object": "whatsapp_business_account",
                                "entry": []
                            }
                        """))
                .andExpect(status().isUnauthorized());
    }
}
