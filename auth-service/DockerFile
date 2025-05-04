# Use Node official image
FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose service port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
