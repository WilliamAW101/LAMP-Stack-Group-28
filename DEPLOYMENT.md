# Deployment Guide

## Environment Variable Issue Fix

The application now uses a runtime configuration system to handle API URLs in production deployments.

## Quick Fix

### Option 1: Update the configuration file directly

1. Edit `public/config.js`
2. Replace `https://your-backend-url.com` with your actual backend URL
3. Deploy the application

### Option 2: Use the update script

```bash
# Update configuration with your API URL
npm run update-config https://your-actual-backend-url.com

# Build for production
npm run build:prod
```

### Option 3: Manual deployment script

```bash
# Set your API URL
export API_URL="https://your-actual-backend-url.com"

# Update configuration
node scripts/update-config.js $API_URL

# Build the application
npm run build
```

## How it works

1. **Development**: Uses `process.env.REMOTE_URL` from `.env` file
2. **Production**: Uses the URL from `public/config.js` file
3. **Fallback**: If neither is available, uses the default URL in `src/config/api.ts`

## Files to update for deployment

1. **`public/config.js`** - Update the API URL here
2. **`src/config/api.ts`** - Update the `DEFAULT_API_URL` constant
3. **Environment variables** - Set `REMOTE_URL` in your deployment platform

## Deployment Platforms

### Netlify
- Set environment variable `REMOTE_URL` in Netlify dashboard
- Or update `public/config.js` before deployment

### Vercel
- Set environment variable `REMOTE_URL` in Vercel dashboard
- Or update `public/config.js` before deployment

### GitHub Pages
- Update `public/config.js` before building
- Use `npm run build:prod` for automated configuration

## Testing

After deployment, check the browser console for:
- `🔍 BaseURL Debug Info:` - Shows the URL being used
- `🌐 Using runtime API URL:` - Confirms runtime configuration is working
- `🔧 Using fallback API URL:` - Shows fallback is being used

## Troubleshooting

If you still see `undefined/Login.php`:

1. Check that `public/config.js` has the correct URL
2. Verify the URL doesn't end with a slash
3. Check browser console for debug information
4. Ensure the config.js file is being loaded (check Network tab)
