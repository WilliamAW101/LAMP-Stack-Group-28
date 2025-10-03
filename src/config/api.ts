// API Configuration
// This file handles environment variables for both development and production

// Default API URL - update this with your actual backend URL
const DEFAULT_API_URL = 'https://cop4331-fraley.com/API';


// Function to get the API base URL
export const getApiBaseUrl = (): string => {
    // In development, use environment variable
    if (process.env.NODE_ENV === 'development') {
        return process.env.REMOTE_URL || DEFAULT_API_URL;
    }

    // In production (static export), we need to use a hardcoded URL
    // or get it from a configuration file
    return DEFAULT_API_URL;
};

// Get the API URL with fallback strategy
export const getRuntimeApiUrl = (): string => {
    // Always use the default URL for now to ensure it works
    const apiUrl = DEFAULT_API_URL;
    return apiUrl;
};

// Export the current API URL
export const API_BASE_URL = getApiBaseUrl();
