-- Simple MySQL initialization for Laravel
CREATE DATABASE IF NOT EXISTS `task_manager` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'task_user'@'%' IDENTIFIED BY 'secret_password';
GRANT ALL PRIVILEGES ON `task_manager`.* TO 'task_user'@'%';
FLUSH PRIVILEGES;
