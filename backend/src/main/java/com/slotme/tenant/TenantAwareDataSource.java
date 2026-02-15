package com.slotme.tenant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.DelegatingDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;

/**
 * DataSource wrapper that sets the PostgreSQL session variable
 * {@code app.current_tenant_id} on every connection obtained from the pool.
 * This ensures Row-Level Security (RLS) policies work correctly.
 */
public class TenantAwareDataSource extends DelegatingDataSource {

    private static final Logger log = LoggerFactory.getLogger(TenantAwareDataSource.class);

    public TenantAwareDataSource(DataSource targetDataSource) {
        super(targetDataSource);
    }

    @Override
    public Connection getConnection() throws SQLException {
        Connection connection = super.getConnection();
        setTenantContext(connection);
        return connection;
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        Connection connection = super.getConnection(username, password);
        setTenantContext(connection);
        return connection;
    }

    private void setTenantContext(Connection connection) throws SQLException {
        UUID tenantId = TenantContext.getCurrentTenantId();
        if (tenantId != null) {
            // UUID.toString() only produces hex chars and dashes, safe for inline SQL.
            // PostgreSQL SET does not support parameterized values.
            try (var stmt = connection.createStatement()) {
                stmt.execute("SET app.current_tenant_id = '" + tenantId + "'");
            }
            log.debug("Set PostgreSQL tenant context: {}", tenantId);
        } else {
            // Reset to avoid leaking tenant context from a previously-used pooled connection.
            // Use RESET which removes the setting entirely, making current_setting return null
            // (with the true parameter in RLS policies).
            try (var stmt = connection.createStatement()) {
                stmt.execute("RESET app.current_tenant_id");
            }
        }
    }
}
