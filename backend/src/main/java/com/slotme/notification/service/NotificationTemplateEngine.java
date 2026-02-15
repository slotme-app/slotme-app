package com.slotme.notification.service;

import com.slotme.notification.entity.NotificationTemplate;
import com.slotme.notification.repository.NotificationTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NotificationTemplateEngine {

    private static final Logger log = LoggerFactory.getLogger(NotificationTemplateEngine.class);
    private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\{\\{(\\w+)}}");

    private final NotificationTemplateRepository templateRepository;

    public NotificationTemplateEngine(NotificationTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public String render(String template, Map<String, String> variables) {
        if (template == null) return "";
        Matcher matcher = VARIABLE_PATTERN.matcher(template);
        StringBuilder result = new StringBuilder();
        while (matcher.find()) {
            String key = matcher.group(1);
            String value = variables.getOrDefault(key, "");
            matcher.appendReplacement(result, Matcher.quoteReplacement(value));
        }
        matcher.appendTail(result);
        return result.toString();
    }

    public List<NotificationTemplate> resolveTemplates(UUID tenantId, UUID salonId, String triggerEvent) {
        // First try salon-specific templates
        List<NotificationTemplate> templates =
                templateRepository.findBySalonIdAndTriggerEventAndActiveTrue(salonId, triggerEvent);

        // Fall back to tenant-level templates (salon_id IS NULL)
        if (templates.isEmpty()) {
            templates = templateRepository.findByTenantIdAndSalonIdIsNullAndTriggerEventAndActiveTrue(
                    tenantId, triggerEvent);
        }

        if (templates.isEmpty()) {
            log.debug("No active templates found for trigger={}, salon={}, tenant={}",
                    triggerEvent, salonId, tenantId);
        }

        return templates;
    }
}
