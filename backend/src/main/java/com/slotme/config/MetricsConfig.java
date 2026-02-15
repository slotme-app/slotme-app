package com.slotme.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    @Bean
    public Counter appointmentCreatedCounter(MeterRegistry registry) {
        return Counter.builder("appointment.created.total")
                .description("Total appointments created")
                .register(registry);
    }

    @Bean
    public Counter bookingConflictCounter(MeterRegistry registry) {
        return Counter.builder("booking.conflict.total")
                .description("Total booking conflicts detected")
                .register(registry);
    }

    @Bean
    public Counter whatsappMessageSentCounter(MeterRegistry registry) {
        return Counter.builder("whatsapp.message.sent.total")
                .description("Total WhatsApp messages sent")
                .register(registry);
    }

    @Bean
    public Timer aiConversationTimer(MeterRegistry registry) {
        return Timer.builder("ai.conversation.duration")
                .description("AI conversation processing duration")
                .register(registry);
    }
}
