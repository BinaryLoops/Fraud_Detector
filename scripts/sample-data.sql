-- Generate sample data for demonstration
-- Run this after the main schema is created

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

-- Insert additional performance metrics with timestamps
INSERT INTO public.performance_metrics (metric_name, metric_value, metric_type, timestamp, metadata) VALUES
('transactions_processed', 15420, 'business', NOW() - INTERVAL '1 hour', '{"period": "hourly"}'),
('fraud_detected', 23, 'security', NOW() - INTERVAL '1 hour', '{"period": "hourly"}'),
('false_positives', 3, 'ai', NOW() - INTERVAL '1 hour', '{"model_accuracy": 92.5}'),
('system_uptime', 99.9, 'system', NOW() - INTERVAL '1 hour', '{"percentage": true}'),
('api_calls', 8750, 'performance', NOW() - INTERVAL '1 hour', '{"endpoint": "all"}'),
('database_queries', 45230, 'database', NOW() - INTERVAL '1 hour', '{"avg_response_time": 12.5}'),
('active_users', 156, 'business', NOW() - INTERVAL '1 hour', '{"concurrent": true}'),
('alert_resolution_time', 8.5, 'security', NOW() - INTERVAL '1 hour', '{"average_minutes": true}');

-- Create some sample user sessions (these will be created automatically when users log in)
-- This is just for demonstration of the table structure
