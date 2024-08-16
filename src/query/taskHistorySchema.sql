CREATE TABLE taskhistories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  action VARCHAR(255) NOT NULL, 
  field_name VARCHAR(255) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by VARCHAR(255) NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
