CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('seeker', 'employer') NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE Jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    salary DECIMAL(10, 2),
    description TEXT,
    status ENUM('active', 'closed') DEFAULT 'active',
    FOREIGN KEY (employer_id) REFERENCES Users(user_id)
);

CREATE TABLE Applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    resume_link VARCHAR(255) NOT NULL,
    date_applied DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id)
);
