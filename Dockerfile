# Use official Node.js runtime
FROM node:18-alpine

WORKDIR /app

# Copy root package.json only (no package-lock.json, it will be generated)
COPY package.json ./

# Install root dependencies (skip postinstall for now - we'll build manually)
RUN npm install --ignore-scripts

# Copy backend package.json
COPY backend/package.json ./backend/package.json

# Install backend dependencies
RUN cd backend && npm install

# Copy all source files
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Start backend server (serves both API and frontend)
CMD ["npm", "start"]
