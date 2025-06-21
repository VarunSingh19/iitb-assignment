# IITB Courses Management System

A Spring Boot-based server application for managing courses with a modern frontend interface.

## Project Structure

```
iitb_assignment/
├── client/           # Frontend application
├── server/           # Spring Boot server
└── docker-compose.yml # Container orchestration
```

## Features

- RESTful API for course management
- Docker containerization
- MySQL database integration
- CORS support for frontend communication

## API Documentation

### Base URL
`http://localhost:8080/api`

### Course Endpoints

#### 1. Create Course
- **Method**: POST
- **Path**: `/api/courses`
- **Request Body**: Course object
- **Response**: Created course object
- **Status**: 201 (Created)

#### 2. Get All Courses
- **Method**: GET
- **Path**: `/api/courses`
- **Response**: List of all courses
- **Status**: 200 (OK)

#### 3. Get Single Course
- **Method**: GET
- **Path**: `/api/courses/{id}`
- **Parameters**: 
  - `id`: Course ID (Long)
- **Response**: Single course object
- **Status**: 200 (OK)

#### 4. Delete Course
- **Method**: DELETE
- **Path**: `/api/courses/{id}`
- **Parameters**: 
  - `id`: Course ID (Long)
- **Response**: No content
- **Status**: 204 (No Content)

### Course Instance Endpoints

#### 1. Create Course Instance
- **Method**: POST
- **Path**: `/api/instances`
- **Request Body**: CourseInstanceRequest object
- **Response**: Created course instance
- **Status**: 201 (Created)

#### 2. Get All Course Instances
- **Method**: GET
- **Path**: `/api/instances`
- **Response**: List of all course instances
- **Status**: 200 (OK)

#### 3. Get Course Instances by Year and Semester
- **Method**: GET
- **Path**: `/api/instances/{year}/{semester}`
- **Parameters**: 
  - `year`: Academic year (int)
  - `semester`: Semester number (int)
- **Response**: List of course instances for given year and semester
- **Status**: 200 (OK)

#### 4. Get Specific Course Instance
- **Method**: GET
- **Path**: `/api/instances/{year}/{semester}/{courseId}`
- **Parameters**: 
  - `year`: Academic year (int)
  - `semester`: Semester number (int)
  - `courseId`: Course ID (Long)
- **Response**: Specific course instance
- **Status**: 200 (OK)

#### 5. Delete Course Instance
- **Method**: DELETE
- **Path**: `/api/instances/{year}/{semester}/{courseId}`
- **Parameters**: 
  - `year`: Academic year (int)
  - `semester`: Semester number (int)
  - `courseId`: Course ID (Long)
- **Response**: No content
- **Status**: 204 (No Content)

### Prerequisites

The system supports course prerequisites through relationships in the database. Prerequisites are managed through:
- Course entity relationships
- Database constraints
- Business logic in the CourseService

#### Prerequisite Rules
- A course can have multiple prerequisites
- Prerequisites must be valid existing courses
- Circular dependencies are prevented
- Prerequisites are enforced at course instance creation

#### Prerequisite Validation
- Courses are checked for prerequisite completion
- Invalid prerequisite chains are detected
- Prerequisites are validated during course instance creation
- Prerequisite status is tracked in the database

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Java 17 or higher
- MySQL 8.0

### Using Docker

#### 1. Build and Run with Docker Compose

To build and run the entire application stack:

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

This will:
- Build and start all services
- Create and initialize the MySQL database
- Start the backend server on port 8080
- Start the frontend on port 3000

#### 2. Build Docker Images Separately

If you want to build the images separately:

```bash
# Build backend image
docker build -t varunsinghh09/iitb-backend:latest -f server/Dockerfile .

# Build frontend image
docker build -t varunsinghh09/iitb-frontend:latest -f client/Dockerfile .
```

#### 3. Run Individual Containers

You can also run individual containers:

```bash
# Run MySQL container
docker run -d --name iitb-db \
  -p 3306:3306 \
  -e MYSQL_DATABASE=courses_db \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  mysql:8.0

# Run backend container
docker run -d --name iitb-backend \
  -p 8080:8080 \
  --link iitb-db:db \
  varunsinghh09/iitb-backend:latest

# Run frontend container
docker run -d --name iitb-frontend \
  -p 3000:80 \
  varunsinghh09/iitb-frontend:latest
```

#### 4. Docker Commands

Common Docker commands for managing containers:

```bash
# View running containers
docker ps

# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend

# Restart a specific service
docker-compose restart backend
```

### Environment Variables

The application uses the following environment variables:
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Database schema management strategy

### Container Ports

The application uses the following ports:
- MySQL: `3306`
- Backend: `8080`
- Frontend: `3000`

### Database Configuration

The application uses MySQL 8.0 with the following configuration:
- Database name: `courses_db`
- Port: 3306
- Username: `root`
- Password: (empty for development)

### CORS Configuration

The server is configured to allow CORS requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)
- `http://localhost`
- `http://localhost:80`

## Security

The application uses Spring Security with:
- CORS enabled for specific origins
- Credentials allowed
- All HTTP methods supported
- 1 hour max age for CORS preflight requests

## Development

### Running the Server Locally

1. Build the project:
```bash
mvn clean install
```

2. Run the application:
```bash
mvn spring-boot:run
```

The server will start on port 8080.

### Testing

The API can be tested using:
- Postman
- curl
- Any REST client

Example curl command:
```bash
curl -X POST http://localhost:8080/api/courses \
-H "Content-Type: application/json" \
-d '{"name": "Sample Course", "description": "Course description"}'
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
