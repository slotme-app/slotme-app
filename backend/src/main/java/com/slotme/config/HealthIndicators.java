package com.slotme.config;

import com.slotme.messaging.config.WhatsAppProperties;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class HealthIndicators {

    @Bean
    public HealthIndicator databaseHealthIndicator(DataSource dataSource) {
        return () -> {
            try (Connection conn = dataSource.getConnection()) {
                try (var stmt = conn.createStatement()) {
                    stmt.execute("SELECT 1");
                }
                return Health.up().withDetail("database", "PostgreSQL").build();
            } catch (Exception e) {
                return Health.down().withDetail("database", "PostgreSQL")
                        .withException(e).build();
            }
        };
    }

    @Bean
    @ConditionalOnBean(RedisConnectionFactory.class)
    public HealthIndicator redisHealthIndicator(RedisConnectionFactory connectionFactory) {
        return () -> {
            try {
                connectionFactory.getConnection().ping();
                return Health.up().withDetail("cache", "Redis").build();
            } catch (Exception e) {
                return Health.down().withDetail("cache", "Redis")
                        .withException(e).build();
            }
        };
    }

    @Bean
    public HealthIndicator whatsappHealthIndicator(WhatsAppProperties properties) {
        return () -> {
            boolean configured = properties.accessToken() != null
                    && !properties.accessToken().isBlank()
                    && !"placeholder".equals(properties.accessToken());
            if (configured) {
                return Health.up().withDetail("whatsapp", "configured").build();
            }
            return Health.unknown().withDetail("whatsapp", "not configured").build();
        };
    }
}
