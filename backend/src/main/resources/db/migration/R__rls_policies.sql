-- Repeatable migration: RLS policies for tenant isolation
-- This file is re-applied whenever its content changes

-- Drop existing policies to recreate them
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
        AND policyname LIKE 'tenant_isolation_%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Tenants: only accessible by the current tenant (self-isolation)
CREATE POLICY tenant_isolation_tenants ON tenants
    USING (id = current_setting('app.current_tenant_id', true)::UUID);

-- Salons: tenant-scoped
CREATE POLICY tenant_isolation_salons ON salons
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Users: tenant-scoped
CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Roles: tenant-scoped
CREATE POLICY tenant_isolation_roles ON roles
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Service categories: tenant-scoped
CREATE POLICY tenant_isolation_service_categories ON service_categories
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Services: tenant-scoped
CREATE POLICY tenant_isolation_services ON services
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Masters: tenant-scoped
CREATE POLICY tenant_isolation_masters ON masters
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Master services: uses master_id FK (no tenant_id column), so RLS via join
-- master_services doesn't have tenant_id directly, but master_id references masters which has RLS
-- We need to handle this differently - add a policy that joins through masters
CREATE POLICY tenant_isolation_master_services ON master_services
    USING (master_id IN (
        SELECT id FROM masters
        WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    ));

-- Calendars: tenant-scoped
CREATE POLICY tenant_isolation_calendars ON calendars
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Availability rules: via calendar -> tenant
CREATE POLICY tenant_isolation_availability_rules ON availability_rules
    USING (calendar_id IN (
        SELECT id FROM calendars
        WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    ));

-- Time blocks: via calendar -> tenant
CREATE POLICY tenant_isolation_time_blocks ON time_blocks
    USING (calendar_id IN (
        SELECT id FROM calendars
        WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    ));

-- Clients: tenant-scoped
CREATE POLICY tenant_isolation_clients ON clients
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Client preferences: via client -> tenant
CREATE POLICY tenant_isolation_client_preferences ON client_preferences
    USING (client_id IN (
        SELECT id FROM clients
        WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    ));

-- Appointments: tenant-scoped
CREATE POLICY tenant_isolation_appointments ON appointments
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Appointment history: via appointment -> tenant
CREATE POLICY tenant_isolation_appointment_history ON appointment_history
    USING (appointment_id IN (
        SELECT id FROM appointments
        WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    ));

-- Conversations: tenant-scoped
CREATE POLICY tenant_isolation_conversations ON conversations
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Messages: via conversation -> tenant
CREATE POLICY tenant_isolation_messages ON messages
    USING (conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    ));

-- Notification templates: tenant-scoped
CREATE POLICY tenant_isolation_notification_templates ON notification_templates
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Notifications: tenant-scoped
CREATE POLICY tenant_isolation_notifications ON notifications
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Client notes: via client -> tenant
CREATE POLICY tenant_isolation_client_notes ON client_notes
    USING (client_id IN (
        SELECT id FROM clients
        WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    ));
