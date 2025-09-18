/**
 * Environment configuration
 * Centralized access to environment variables
 */

export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Development flags
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  
  // Add other environment variables as needed
  // APP_NAME: import.meta.env.VITE_APP_NAME || 'Abyzma',
  // DEBUG: import.meta.env.VITE_DEBUG === 'true',
} as const;

// Debug logging for environment variables (remove in production)
if (import.meta.env.PROD) {
  console.log('Environment variables in production:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    allEnvVars: import.meta.env,
  });
}

// Type-safe environment variable access
export type EnvConfig = typeof env;
