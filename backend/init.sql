CREATE TABLE users (
id SERIAL PRIMARY KEY,
username TEXT UNIQUE,
password TEXT,
role TEXT
);


CREATE TABLE employee (
id SERIAL PRIMARY KEY,
name TEXT,
department TEXT,
role TEXT,
photo TEXT
);


CREATE TABLE audit_logs (
id SERIAL PRIMARY KEY,
action TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- default admin (password: admin123)
INSERT INTO users(username,password,role)
VALUES('admin', '$2b$10$YHkLZ8Z0O4YyTt4M7uZXkOdF0U4nQZxW0Zx4rF8P3A4FQGgCz5x5C', 'ADMIN');
