# Movie Review Platform

A comprehensive full-stack movie review application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to browse movies, read and write reviews, and manage a personal watchlist. It features a robust Admin Dashboard for content management.

## Features

- **User Authentication**: Secure JWT-based authentication (Register/Login).
- **Role-Based Access Control**: specialized **Admin** role for managing content.
- **Movie Management**:
  - Browse movies with pagination and search functionality.
  - Filter movies by genre.
  - View detailed movie information (Cast, Director, Synopsis).
- **Review System**:
  - Users can rate and review movies (1-5 stars).
  - Real-time average rating calculation for movies.
- **Watchlist**: Users can add movies to their personal watchlist (tracked by date added).
- **Admin Dashboard**:
  - **Manage Movies**: Add new movies, delete existing ones.
  - **Manage Users**: View users, promote/demote roles, delete users.
  - **Manage Reviews**: Monitor and moderate reviews (Edit/Delete).
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons), Axios, React Router DOM.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js (Password Hashing).
- **Security**: Express Rate Limit, CORS protection.

## Setup Instructions

### Prerequisites

- **Node.js** (v14+ recommended)
- **MongoDB**: A running MongoDB instance (Local or Atlas Cloud).

### Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd movie-recommendation-system
    ```

2.  **Install Dependencies**:
    Run the following command from the root directory to install dependencies for both client and server:

    ```bash
    npm run install-all
    ```

    _Alternatively, install individually:_
    - `cd server && npm install`
    - `cd client && npm install`

3.  **Environment Variables**:
    Create a `.env` file in the `server` directory with the following variables:

    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/movie-app
    JWT_SECRET=your_super_secret_jwt_key
    ```

    _Note: Replace `mongodb://localhost...` with your actual connection string if different._

### Running the Application

To run both the backend and frontend concurrently (development mode):

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## API Documentation

### Movies

| Method   | Endpoint          | Description                                                          | Access    |
| :------- | :---------------- | :------------------------------------------------------------------- | :-------- |
| `GET`    | `/api/movies`     | Get all movies (supports `?page=`, `?limit=`, `?search=`, `?genre=`) | Public    |
| `GET`    | `/api/movies/:id` | Get single movie details                                             | Public    |
| `POST`   | `/api/movies`     | Create a new movie                                                   | **Admin** |
| `DELETE` | `/api/movies/:id` | Delete a movie                                                       | **Admin** |

### Reviews

| Method   | Endpoint                  | Description                      | Access    |
| :------- | :------------------------ | :------------------------------- | :-------- |
| `GET`    | `/api/movies/:id/reviews` | Get reviews for a specific movie | Public    |
| `POST`   | `/api/movies/:id/reviews` | Submit a review                  | User      |
| `PUT`    | `/api/admin/reviews/:id`  | Edit a review (moderation)       | **Admin** |
| `DELETE` | `/api/admin/reviews/:id`  | Delete a review                  | **Admin** |

### Users & Auth

| Method   | Endpoint                    | Description              | Access    |
| :------- | :-------------------------- | :----------------------- | :-------- |
| `POST`   | `/api/auth/register`        | Register a new user      | Public    |
| `POST`   | `/api/auth/login`           | Login user & get Token   | Public    |
| `GET`    | `/api/users/profile`        | Get current user profile | Private   |
| `GET`    | `/api/users/:id`            | Get public user profile  | Public    |
| `GET`    | `/api/users/watchlist`      | Get user watchlist       | Private   |
| `POST`   | `/api/users/watchlist/:id`  | Add movie to watchlist   | Private   |
| `DELETE` | `/api/users/watchlist/:id`  | Remove from watchlist    | Private   |
| `PUT`    | `/api/admin/users/:id/role` | Promote/Demote user role | **Admin** |

## Database Schema Design

The application uses three main schemas:

1.  **User**: Stores user credentials, role (`user`/`admin`), and a `watchlist` array containing movie references and added dates.
2.  **Movie**: Stores movie metadata (`title`, `genre`, `cast`, etc.) and a calculated `averageRating`.
3.  **Review**: Links a `User` and `Movie` with a `rating` (1-5), `text`, and `timestamp`.

## Design Decisions

- **Separation of Concerns**: The project is structured as a monorepo with distinct `client` and `server` directories to simulate a real-world microservices-like architecture.
- **Admin Middleware**: A dedicated `admin` middleware was created to protect sensitive routes, ensuring unauthorized users cannot access administrative functions.
- **Dynamic Rating Calculation**: Instead of calculating ratings on every read, the average rating is updated and stored on the `Movie` document whenever a review is added or deleted, optimizing read performance.
- **Error Boundaries**: The frontend employs React Error Boundaries to gracefully handle runtime errors and provide a better user experience.
