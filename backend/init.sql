CREATE TABLE IF NOT EXISTS employee (
id SERIAL PRIMARY KEY,
name TEXT,
department TEXT,
role TEXT,
photo TEXT
);


INSERT INTO employee(name,department,role,photo) VALUES
('Vishaal','Java Developer','Employee','https://i.pravatar.cc/150?img=1'),
('Dinesh','DevOps Engineer','Employee','https://i.pravatar.cc/150?img=2');
