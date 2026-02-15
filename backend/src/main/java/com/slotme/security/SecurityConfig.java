package com.slotme.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final Environment environment;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, Environment environment) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.environment = environment;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        boolean isProd = Arrays.asList(environment.getActiveProfiles()).contains("prod");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> {
                    headers.contentTypeOptions(contentType -> {});
                    headers.frameOptions(frame -> frame.deny());
                    headers.cacheControl(cache -> {});
                    if (isProd) {
                        headers.httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000));
                    }
                    headers.contentSecurityPolicy(csp -> csp
                            .policyDirectives("default-src 'self'; " +
                                    "style-src 'self' https://fonts.googleapis.com; " +
                                    "font-src 'self' https://fonts.gstatic.com; " +
                                    "img-src 'self' data:; " +
                                    "script-src 'self'; " +
                                    "frame-ancestors 'none'"));
                })
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/v1/auth/register", "/api/v1/auth/login",
                                    "/api/v1/auth/refresh", "/api/v1/auth/forgot-password",
                                    "/api/v1/auth/reset-password",
                                    "/api/v1/auth/password-reset/request",
                                    "/api/v1/auth/password-reset/confirm").permitAll()
                            .requestMatchers("/api/v1/webhooks/**").permitAll()
                            .requestMatchers("/actuator/health/**", "/actuator/info",
                                    "/actuator/prometheus").permitAll()
                            .requestMatchers("/actuator/**").hasRole("PLATFORM_ADMIN")
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .requestMatchers("/api/v1/**").authenticated();
                    if (!isProd) {
                        auth.requestMatchers("/swagger-ui/**", "/api-docs/**",
                                "/swagger-ui.html").permitAll();
                    }
                    auth.anyRequest().permitAll();
                })
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
