# Task Management System

## Overview

This Task Management System is implemented using Node.js, TypeScript, MySQL, and Sequelize. It provides a set of RESTful APIs for managing tasks, including creating, updating, deleting, and retrieving tasks. The system also supports task history tracking and unit testing to ensure robust functionality.

## Prerequisites
- Node.js: >=14.x
- MySQL or MariaDB: Make sure you have MySQL or MariaDB installed and running.

## Installation

1. Clone the repository 

2. Install dependencies: `npm install`

3. Configure the database

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=taskdb
DATABASE_NAME=task_management_system

4. Initialize the Database

mysql -u root -p < query/taskSchema.sql

5. Start the server: `npm run dev`

## API Endpoints

1. Task Management

- `POST /create-task`: Create a new task
- `PATCH /task/:id`: Update an existing task
- `DELETE /task/:id`: Delete a task
- `GET /task/:id`: Retrieve a task by its ID
- `GET /tasks`: List all tasks with pagination, filtering, and sorting

2. Task History

- `GET /task/:id/history`: Retrieve the history of changes for a specific task.

## Task Object Structure

```json
{
    "id": "number",       
    "title": "string", 
    "description": "string",
    "status": "string",
    "priority": "string",
    "due_date": "Date",
    "created_at": "Date",
    "updated_at": "Date",  
    "deleted_at": "Date"
```

## Task History Object Structure

```json
{
    "id": "number",
    "task_id": "number",
    "field_name": "string",
    "old_value": "string | Date | null",
    "new_value": "string | Date | null",
    "action": "string",
    "changed_by": "string"
}

```

## Running Tests

1. Install Testing Dependencies

   -  npm install --save-dev jest supertest @types/jest @types/supertest

2. Run Unit Tests

   - npm test

3. Run Specific Test

   - npm test -- <test-file>
  

## Database Schema

1. The SQL file for the schema is included in the project. You can find it in the schema directory:

`query/taskSchema.sql`: SQL schema for the tasks table

`query/taskHistorySchema.sql`: SQL schema for the task history table