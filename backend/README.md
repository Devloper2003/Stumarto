# School Marketplace Backend

Backend API for School Marketplace built with Node.js, Express, and MongoDB.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## Installation

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
   (On Windows PowerShell, use: `Copy-Item .env.example .env`)

2. Edit `.env` and configure your MongoDB connection:

   **For MongoDB Atlas (Cloud):**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
   ```
   
   **Important:** If your password contains special characters, URL-encode them:
   - `<` = `%3C`
   - `@` = `%40`
   - `>` = `%3E`
   - `#` = `%23`
   - `%` = `%25`
   - `/` = `%2F`
   - `:` = `%3A`
   
   Example: Password `<Stumarto@321>` becomes `%3CStumarto%40321%3E`
   
   **For Local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/school-marketplace
   ```

## Running the Backend

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## Test the API

Once the server is running, you can test it by visiting:
- Browser: `http://localhost:5000/`
- Or use curl: `curl http://localhost:5000/`

You should see a JSON response:
```json
{
  "success": true,
  "message": "School Marketplace API is running!",
  "timestamp": "2026-01-26T..."
}
```

## Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env.example       # Example environment variables
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## MongoDB Setup

Make sure MongoDB is running on your system:

- **Local MongoDB**: Ensure MongoDB service is running
- **MongoDB Atlas**: Use your Atlas connection string in `.env`

## Next Steps

- Add routes in `routes/` folder
- Add models in `models/` folder
- Add middleware in `middleware/` folder
- Add controllers in `controllers/` folder
