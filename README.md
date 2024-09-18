# NYCTransitHub

NYTransit is a web application for managing transit-related information and services in New York.

## Project Description

This project is a backend service for a transit application, handling user authentication, data storage, and API endpoints for transit-related information. It uses Express.js as the web framework and MongoDB as the database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js (version 16.20.1 or later)
* You have a MongoDB instance running (version 6.x or later)

## Installation

To install NYTransit, follow these steps:

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install the dependencies

## Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
```


Adjust the values according to your environment.

## Usage

To run the application:

1. Start the server: `npm start`



The server will start on the port specified in your `.env` file (default 3000).

## Features

- Weather Podcast
- Paper Map / Real Time Map
- Mail service through SMTP
- User's Saved Routes 
- Path Recommendation based on location
- Train Service Alerts / Elevator Status
- Language Selection
- Application Level Security (Password Hashing, ACL)
- Database Level Security (User Roles)

## License

(Include license information here)

## Contact

(Include contact information here)

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [cors](https://github.com/expressjs/cors)
