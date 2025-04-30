# School Management API

A Node.js/Express API for managing school data with proximity-based sorting functionality.

## Features

- Add new schools with name, address, and geographical coordinates
- List all schools sorted by proximity to a given location
- Input validation for all fields
- MySQL database integration

## Technologies Used

- Node.js
- Express.js
- MySQL
- Postman (for API testing)

## API Endpoints

### 1. Add School

**Endpoint:** `POST /addSchool`

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "latitude": "float",
  "longitude": "float"
}