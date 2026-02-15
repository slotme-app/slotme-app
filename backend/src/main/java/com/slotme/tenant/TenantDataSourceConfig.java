package com.slotme.tenant;

import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Wraps the auto-configured DataSource with {@link TenantAwareDataSource}
 * so that PostgreSQL RLS session variable is set on every connection.
 */
@Configuration
public class TenantDataSourceConfig {

    @Bean
    static BeanPostProcessor tenantDataSourcePostProcessor() {
        return new BeanPostProcessor() {
            @Override
            public Object postProcessAfterInitialization(Object bean, String beanName) {
                if (bean instanceof DataSource ds && !(bean instanceof TenantAwareDataSource)) {
                    return new TenantAwareDataSource(ds);
                }
                return bean;
            }
        };
    }
}
