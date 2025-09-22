# CapRover Deployment Guide

## Environment Variables Configuration

Before deploying to CapRover, you need to set the following environment variables in your CapRover dashboard:

### Required Environment Variables

1. **REACT_APP_API_URL** 
   - Description: Backend API endpoint URL
   - Example: `https://your-backend-api.domain.com`
   - Required: Yes

2. **REACT_APP_API_KEY**
   - Description: API key for backend authentication
   - Example: `your_api_key_here`
   - Required: Yes

### Optional Environment Variables

3. **CAPROVER_GIT_COMMIT_SHA**
   - Description: Automatically set by CapRover (Git commit SHA)
   - Note: This is automatically provided by CapRover
   - Required: No (auto-generated)

## Setting Environment Variables in CapRover

1. Go to your CapRover dashboard
2. Navigate to your app's settings
3. Go to "App Configs" → "Environmental Variables"
4. Add the following variables:

```
REACT_APP_API_URL=https://your-backend-api.domain.com
REACT_APP_API_KEY=your_actual_api_key_here
```

## How It Works

- During the Docker build process, CapRover passes these environment variables as build arguments
- The Dockerfile uses `ARG` to accept these values at build time
- The `ENV` commands make them available during the React build process
- React embeds these values into the static bundle during `npm run build`
- The final built application contains the environment-specific configuration

## Deployment Steps

1. Set environment variables in CapRover dashboard
2. Push your code to the connected Git repository
3. CapRover will automatically build and deploy with the configured environment variables

## Notes

- Environment variables starting with `REACT_APP_` are embedded into the client-side bundle
- Changes to environment variables require a new deployment to take effect
- The backend API URL should point to your backend CapRover app or external API endpoint