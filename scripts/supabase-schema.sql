-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE risk_level AS ENUM ('high', 'medium', 'low', 'pending');
CREATE TYPE transaction_status AS ENUM ('approved', 'declined', 'pending', 'flagged');
CREATE TYPE alert_type AS ENUM ('fraud', 'anomaly', 'pattern', 'velocity', 'geographic', 'amount');
CREATE TYPE alert_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE alert_status AS ENUM ('active', 'investigating', 'resolved', 'dismissed');
CREATE TYPE rule_type AS ENUM ('amount', 'velocity', 'geographic', 'pattern', 'time');
CREATE TYPE rule_action AS ENUM ('block', 'flag', 'review');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT DEFAULT 'analyst',
    phone TEXT,
    avatar_url TEXT,
    status user_status DEFAULT 'active',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    merchant_name TEXT NOT NULL,
    merchant_category TEXT NOT NULL,
    location TEXT NOT NULL,
    card_number TEXT NOT NULL,
    risk_level risk_level DEFAULT 'pending',
    ai_analysis JSONB,
    status transaction_status DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status alert_status DEFAULT 'active',
    confidence DECIMAL(3,2) DEFAULT 0.5,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud rules table
CREATE TABLE public.fraud_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type rule_type NOT NULL,
    conditions JSONB NOT NULL DEFAULT '{}',
    action rule_action NOT NULL,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    parameters JSONB DEFAULT '{}',
    status TEXT DEFAULT 'ready',
    file_url TEXT,
    file_size BIGINT,
    format TEXT DEFAULT 'PDF',
    generated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table for tracking
CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    location TEXT,
    login_at TIMESTAMPTZ DEFAULT NOW(),
    logout_at TIMESTAMPTZ
);

-- Audit log table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Events Table
CREATE TABLE public.security_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE TABLE public.security_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value BOOLEAN DEFAULT false,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE public.performance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_risk_level ON public.transactions(risk_level);
CREATE INDEX idx_transactions_status ON public.transactions(status);

CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);

CREATE INDEX idx_fraud_rules_is_active ON public.fraud_rules(is_active);
CREATE INDEX idx_fraud_rules_priority ON public.fraud_rules(priority DESC);

CREATE INDEX idx_security_events_timestamp ON public.security_events(timestamp DESC);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_status ON public.security_events(status);

CREATE INDEX idx_performance_metrics_timestamp ON public.performance_metrics(timestamp DESC);
CREATE INDEX idx_performance_metrics_type ON public.performance_metrics(metric_type);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_rules_updated_at BEFORE UPDATE ON public.fraud_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_events_updated_at BEFORE UPDATE ON public.security_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON public.security_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can view transactions
CREATE POLICY "Users can view transactions" ON public.transactions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create transactions
CREATE POLICY "Users can create transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update transactions
CREATE POLICY "Users can update transactions" ON public.transactions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Users can view alerts
CREATE POLICY "Users can view alerts" ON public.alerts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create alerts
CREATE POLICY "Users can create alerts" ON public.alerts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update alerts
CREATE POLICY "Users can update alerts" ON public.alerts
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Users can view fraud rules
CREATE POLICY "Users can view fraud rules" ON public.fraud_rules
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can manage fraud rules
CREATE POLICY "Users can manage fraud rules" ON public.fraud_rules
    FOR ALL USING (auth.role() = 'authenticated');

-- Users can view reports
CREATE POLICY "Users can view reports" ON public.reports
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create reports
CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = generated_by);

-- Users can update their own reports
CREATE POLICY "Users can update own reports" ON public.reports
    FOR UPDATE USING (auth.uid() = generated_by);

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view audit logs
CREATE POLICY "Users can view audit logs" ON public.audit_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can view security events
CREATE POLICY "Users can view security events" ON public.security_events
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can manage security events
CREATE POLICY "Users can manage security events" ON public.security_events
    FOR ALL USING (auth.role() = 'authenticated');

-- Users can view security settings
CREATE POLICY "Users can view security settings" ON public.security_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can manage security settings
CREATE POLICY "Users can manage security settings" ON public.security_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Users can view system settings
CREATE POLICY "Users can view system settings" ON public.system_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can manage system settings
CREATE POLICY "Users can manage system settings" ON public.system_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Users can view performance metrics
CREATE POLICY "Users can view performance metrics" ON public.performance_metrics
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create performance metrics
CREATE POLICY "Users can create performance metrics" ON public.performance_metrics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, company, role, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'company', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'analyst'),
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to important tables
CREATE TRIGGER audit_transactions
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

CREATE TRIGGER audit_alerts
    AFTER INSERT OR UPDATE OR DELETE ON public.alerts
    FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

CREATE TRIGGER audit_fraud_rules
    AFTER INSERT OR UPDATE OR DELETE ON public.fraud_rules
    FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- Insert sample fraud rules
INSERT INTO public.fraud_rules (name, description, type, conditions, action, priority, created_by) VALUES
('High Amount Transaction', 'Flag transactions over $5000', 'amount', '{"threshold": 5000}', 'flag', 1, NULL),
('Velocity Check', 'Block more than 5 transactions in 1 minute', 'velocity', '{"max_transactions": 5, "time_window": 60}', 'block', 2, NULL),
('Geographic Risk', 'Flag transactions from high-risk countries', 'geographic', '{"high_risk_countries": ["NG", "RU", "CN"]}', 'flag', 3, NULL),
('Night Time Transactions', 'Review transactions between 2-5 AM', 'time', '{"start_hour": 2, "end_hour": 5}', 'review', 4, NULL),
('Multiple Card Usage', 'Flag when same card used in different locations within 1 hour', 'pattern', '{"time_window": 3600, "location_threshold": 100}', 'flag', 5, NULL);

-- Insert default security settings
INSERT INTO public.security_settings (setting_name, setting_value, description, category) VALUES
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
INSERT INTO public.system_settings (setting_key, setting_value, category, description) VALUES
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
('theme', 'dark', 'appearance', 'Default theme'),
('language', 'en', 'appearance', 'Default language'),
('compact_mode', 'false', 'appearance', 'Enable compact mode'),
('animations', 'true', 'appearance', 'Enable UI animations')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample security events
INSERT INTO public.security_events (event_type, description, severity, user_id, ip_address, status) VALUES
('Failed Login', 'Multiple failed login attempts detected', 'medium', NULL, '192.168.1.100', 'resolved'),
('Suspicious Transaction', 'High-value transaction from new location', 'high', NULL, '10.0.0.50', 'investigating'),
('Data Access', 'Unusual data access pattern detected', 'low', NULL, '172.16.0.25', 'open'),
('System Alert', 'High CPU usage detected on server', 'medium', NULL, NULL, 'resolved'),
('Security Scan', 'Port scan detected from external IP', 'high', NULL, '203.0.113.10', 'investigating'),
('Brute Force Attack', 'Multiple login attempts from same IP', 'critical', NULL, '198.51.100.10', 'investigating'),
('Unusual Access Pattern', 'Access from new geographic location', 'medium', NULL, '203.0.113.50', 'open')
ON CONFLICT DO NOTHING;

-- Insert sample performance metrics
INSERT INTO public.performance_metrics (metric_name, metric_value, metric_type, metadata) VALUES
('cpu_usage', 75.5, 'system', '{"server": "web-01"}'),
('memory_usage', 82.3, 'system', '{"server": "web-01"}'),
('response_time', 245.7, 'performance', '{"endpoint": "/api/transactions"}'),
('throughput', 1250.0, 'performance', '{"requests_per_minute": true}'),
('error_rate', 0.5, 'performance', '{"percentage": true}'),
('database_connections', 45.0, 'database', '{"max_connections": 100}'),
('fraud_detection_accuracy', 94.2, 'ai', '{"model_version": "v2.1"}'),
('alert_response_time', 15.3, 'security', '{"average_seconds": true}');

-- Create a function to generate sample transactions (for demo purposes)
CREATE OR REPLACE FUNCTION generate_sample_transaction()
RETURNS UUID AS $$
DECLARE
    transaction_id UUID;
    sample_merchants TEXT[] := ARRAY['Amazon', 'Walmart', 'Target', 'Best Buy', 'Home Depot', 'Starbucks', 'McDonald''s', 'Shell', 'Exxon', 'CVS'];
    sample_categories TEXT[] := ARRAY['Retail', 'Grocery', 'Gas Station', 'Restaurant', 'Electronics', 'Pharmacy', 'Coffee Shop'];
    sample_locations TEXT[] := ARRAY['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA'];
    sample_amounts DECIMAL[] := ARRAY[25.50, 89.99, 156.78, 45.00, 234.56, 12.99, 567.89, 78.45, 123.00, 345.67];
BEGIN
    INSERT INTO public.transactions (
        amount,
        merchant_name,
        merchant_category,
        location,
        card_number,
        risk_level,
        status,
        ai_analysis
    ) VALUES (
        sample_amounts[floor(random() * array_length(sample_amounts, 1) + 1)],
        sample_merchants[floor(random() * array_length(sample_merchants, 1) + 1)],
        sample_categories[floor(random() * array_length(sample_categories, 1) + 1)],
        sample_locations[floor(random() * array_length(sample_locations, 1) + 1)],
        '**** **** **** ' || lpad(floor(random() * 9999)::text, 4, '0'),
        (ARRAY['low', 'medium', 'high'])[floor(random() * 3 + 1)]::risk_level,
        (ARRAY['approved', 'pending', 'flagged'])[floor(random() * 3 + 1)]::transaction_status,
        jsonb_build_object(
            'risk_level', (ARRAY['low', 'medium', 'high'])[floor(random() * 3 + 1)],
            'confidence', round((random() * 100)::numeric, 2),
            'reasoning', 'AI analysis completed',
            'risk_factors', ARRAY['amount_threshold', 'location_check', 'velocity_check']
        )
    ) RETURNING id INTO transaction_id;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to generate sample alerts
CREATE OR REPLACE FUNCTION generate_sample_alert()
RETURNS UUID AS $$
DECLARE
    alert_id UUID;
    alert_types alert_type[] := ARRAY['fraud', 'anomaly', 'pattern', 'velocity', 'geographic', 'amount'];
    alert_severities alert_severity[] := ARRAY['low', 'medium', 'high', 'critical'];
    sample_titles TEXT[] := ARRAY[
        'Suspicious Transaction Detected',
        'High-Risk Geographic Location',
        'Unusual Spending Pattern',
        'Velocity Threshold Exceeded',
        'Large Amount Transaction',
        'Multiple Failed Attempts'
    ];
BEGIN
    INSERT INTO public.alerts (
        type,
        severity,
        title,
        message,
        status,
        confidence
    ) VALUES (
        alert_types[floor(random() * array_length(alert_types, 1) + 1)],
        alert_severities[floor(random() * array_length(alert_severities, 1) + 1)],
        sample_titles[floor(random() * array_length(sample_titles, 1) + 1)],
        'This alert was generated by the fraud detection system based on suspicious activity patterns.',
        'active',
        round((random() * 0.5 + 0.5)::numeric, 2)
    ) RETURNING id INTO alert_id;
    
    RETURN alert_id;
END;
$$ LANGUAGE plpgsql;

-- Generate 50 sample transactions
SELECT generate_sample_transaction() FROM generate_series(1, 50);

-- Generate 20 sample alerts
SELECT generate_sample_alert() FROM generate_series(1, 20);

-- Insert additional sample reports
INSERT INTO public.reports (name, type, description, status, format, parameters) VALUES
('Monthly Fraud Report', 'fraud_summary', 'Comprehensive fraud analysis for the current month', 'ready', 'PDF', '{"month": "current", "include_charts": true}'),
('Transaction Volume Analysis', 'transaction_analysis', 'Analysis of transaction patterns and volumes', 'ready', 'Excel', '{"date_range": "30_days", "group_by": "merchant"}'),
('Risk Assessment Report', 'risk_analysis', 'Detailed risk assessment across all transactions', 'generating', 'PDF', '{"risk_threshold": "medium", "include_recommendations": true}'),
('Geographic Fraud Patterns', 'geographic_analysis', 'Analysis of fraud patterns by geographic location', 'ready', 'PDF', '{"map_visualization": true, "time_period": "quarterly"}'),
('Velocity Analysis Report', 'velocity_analysis', 'Transaction velocity and frequency analysis', 'ready', 'Excel', '{"threshold_minutes": 5, "min_transactions": 3}');
