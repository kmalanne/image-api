CREATE DATABASE IF NOT EXISTS image_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE image_db;

CREATE TABLE IF NOT EXISTS album (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  uuid VARCHAR(255) NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB;

CREATE INDEX idx_code ON album(code);
CREATE INDEX uuid ON album(uuid);

CREATE TABLE IF NOT EXISTS image (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album INT,
  thumbnail_url VARCHAR(2083) NOT NULL,
  preview_url VARCHAR(2083) NOT NULL,
  fullsize_url VARCHAR(2083),
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album)
  REFERENCES album(id)
  ON DELETE CASCADE
) ENGINE=INNODB;