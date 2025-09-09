FROM node:18-alpine

WORKDIR /app

# Set environment variables for React public runtime configuration
# These values will be inlined into the client-side bundle during the build.
ENV REACT_APP_API_URL="http://back-ticket.nikflow.ir/api"

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]