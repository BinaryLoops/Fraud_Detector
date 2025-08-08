-- Additional tables for management and support sections

-- Security Events Table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    status VARCHAR(20) CHECK (status IN ('open', 'investigating', 'resolved')) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Settings Table
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value BOOLEAN DEFAULT false,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default security settings
INSERT INTO security_settings (setting_name, setting_value, description, category) VALUES
('two_factor_auth', false, 'Enable two-factor authentication', 'authentication'),
('login_notifications', true, 'Send notifications for new logins', 'authentication'),
('session_timeout', true, 'Enable automatic session timeout', 'authentication'),
('password_complexity', true, 'Enforce strong password requirements', 'authentication'),
('firewall_enabled', true, 'Enable firewall protection', 'network'),
('ddos_protection', true, 'Enable DDoS protection', 'network'),
('ssl_enforcement', true, 'Enforce SSL/TLS connections', 'network'),
('intrusion_detection', true, 'Enable intrusion detection system', 'network'),
('data_encryption', true, 'Enable data encryption at rest', 'data protection'),
('backup_encryption', true, 'Enable backup encryption', 'data protection'),
('audit_logging', true, 'Enable comprehensive audit logging', 'monitoring'),
('real_time_monitoring', true, 'Enable real-time security monitoring', 'monitoring')
ON CONFLICT (setting_name) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('session_timeout', '30', 'security', 'Session timeout in minutes'),
('max_login_attempts', '5', 'security', 'Maximum login attempts before lockout'),
('data_retention', '365', 'data', 'Data retention period in days'),
('backup_frequency', 'daily', 'system', 'Backup frequency'),
('maintenance_mode', 'false', 'system', 'Enable maintenance mode'),
('debug_mode', 'false', 'system', 'Enable debug logging'),
('email_notifications', 'true', 'notifications', 'Enable email notifications'),
('push_notifications', 'true', 'notifications', 'Enable push notifications'),
('fraud_alerts', 'true', 'notifications', 'Enable fraud alert notifications'),
('system_updates', 'true', 'notifications', 'Enable system update notifications'),
('theme', 'light', 'appearance', 'Default theme'),
('language', 'en', 'appearance', 'Default language'),
('compact_mode', 'false', 'appearance', 'Enable compact mode'),
('animations', 'true', 'appearance', 'Enable UI animations')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample security events
INSERT INTO security_events (event_type, description, severity, user_id, ip_address, status) VALUES
('Failed Login', 'Multiple failed login attempts detected', 'medium', NULL, '192.168.1.100', 'resolved'),
('Suspicious Transaction', 'High-value transaction from new location', 'high', NULL, '10.0.0.50', 'investigating'),
('Data Access', 'Unusual data access pattern detected', 'low', NULL, '172.16.0.25', 'open'),
('System Alert', 'High CPU usage detected on server', 'medium', NULL, NULL, 'resolved'),
('Security Scan', 'Port scan detected from external IP', 'high', NULL, '203.0.113.10', 'investigating')
ON CONFLICT DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for security_events
CREATE POLICY "Users can view security events" ON security_events
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage security events" ON security_events
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for security_settings
CREATE POLICY "Users can view security settings" ON security_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage security settings" ON security_settings
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for system_settings
CREATE POLICY "Users can view system settings" ON system_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage system settings" ON system_settings
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_status ON security_events(status);
CREATE INDEX IF NOT EXISTS idx_security_settings_category ON security_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_security_events_updated_at BEFORE UPDATE ON security_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON security_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
