-- Notice Period Tracking
ALTER TABLE tenants ADD COLUMN notice_period_days INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN notice_date DATE;
ALTER TABLE tenants ADD COLUMN expected_move_out DATE;

-- Custom Due Date (1-28, NULL = use join_date day)
ALTER TABLE tenants ADD COLUMN rent_due_day INTEGER;
