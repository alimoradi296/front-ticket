FROM node:18-alpine

WORKDIR /app

# Accept build-time arguments from CapRover environment variables
ARG REACT_APP_API_URL=${REACT_APP_API_URL}
ARG REACT_APP_API_KEY=${REACT_APP_API_KEY}
ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}

# Set environment variables for React public runtime configuration
# These values will be inlined into the client-side bundle during the build.
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_API_KEY=${REACT_APP_API_KEY}
ENV REACT_APP_GIT_COMMIT=${CAPROVER_GIT_COMMIT_SHA}

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application with environment variables embedded
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]