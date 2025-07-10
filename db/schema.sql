-- Users table for user management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN (
        'superuser', 'anonymous', 'manager', 'supervisor',
        'printer technician', 'internet technician', 'devices technician',
        'intern', 'officer'
    )),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity log for user actions
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit trail for critical actions
CREATE TABLE IF NOT EXISTS audit_trail (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2FA secrets
CREATE TABLE IF NOT EXISTS user_2fa (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    secret VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- In-app notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id), -- optional link to user account
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(100),
    hired_at DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE employees ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS signature_url VARCHAR(255);

-- Employee ID Cards
CREATE TABLE IF NOT EXISTS employee_id_cards (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    card_number VARCHAR(64) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- active, lost, expired, etc.
    created_at TIMESTAMP DEFAULT NOW()
);

-- ZKTeco Devices
CREATE TABLE IF NOT EXISTS zkteco_devices (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    device_ip VARCHAR(45) NOT NULL,
    device_port INTEGER DEFAULT 4370,
    device_type VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(32) DEFAULT 'active', -- active, inactive, maintenance
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employee-Device Mappings (for biometric enrollment)
CREATE TABLE IF NOT EXISTS employee_device_mappings (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES zkteco_devices(id) ON DELETE CASCADE,
    biometric_id VARCHAR(100), -- ZKTeco internal user ID
    enrolled_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(employee_id, device_id)
);

-- Attendance Logs
CREATE TABLE IF NOT EXISTS attendance_logs (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES zkteco_devices(id),
    log_type VARCHAR(32) NOT NULL, -- check_in, check_out, access_denied
    timestamp TIMESTAMP NOT NULL,
    raw_data TEXT, -- Raw data from device
    created_at TIMESTAMP DEFAULT NOW()
); 