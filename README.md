# **Allowlist Manager - Back-End**

This repository contains the back-end for **Allowlist Manager**, a platform designed for managing allowlists. The back-end is built with **NestJS** and **MySQL** to ensure scalability, efficiency, and a secure, organized data flow.

## **Features**

- **Manage Whitelists:** View, add, and remove allowlists.
- **Create Codes:** Generate and manage access codes for users.
- **View Codes:** Display all created codes and their status.
- **Manage Tickets:** View and manage tickets submitted by users.

## **Technologies Used**

- **NestJS:** A framework for building scalable and modular APIs.
- **TypeORM:** ORM for MySQL database integration.
- **MySQL:** Relational database used to store platform data.
- **Passport.js:** Middleware for authentication.

## Configure Environment Variables

DISCORD_BOT_TOKEN=""
DISCORD_GUILD_ID=
DISCORD_ROLE_APPROVED_ID=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=
SESSION_SECRET=SECRET
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=database
FRONTEND_URL=http://localhost:8080