# Environment Variables Setup

This document explains how to set up the required environment variables for the GlobalBushTravel application.

## Required Environment Variables

Create a `.env.local` file in the root directory of your project with the following variables:

```bash
# Duffel API Configuration
DUFFEL_API_KEY=your_duffel_api_key_here
DUFFEL_API_URL=https://api.duffel.com

# Hotel API Configuration
HOTEL_API_URL=https://api.hotelapi.co
HOTEL_API_KEY=your_hotel_api_key_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://globalbushtravel.com

# Environment
NODE_ENV=development
```

## API Keys Required

### 1. Duffel API Key
- **Purpose**: Flight search and booking functionality
- **How to get**: Sign up at [Duffel.com](https://duffel.com) and get your API key
- **Format**: `duffel_test_` or `duffel_live_` prefix
- **Required**: Yes (for flight functionality)

### 2. Hotel API Key
- **Purpose**: Hotel search and booking functionality
- **How to get**: Sign up at your preferred hotel API provider
- **Format**: Varies by provider
- **Required**: No (hotel functionality will be disabled if not provided)

## Environment Variable Details

### `DUFFEL_API_KEY`
- **Type**: String
- **Required**: Yes
- **Description**: Your Duffel API authentication token
- **Example**: `***REMOVED***`

### `DUFFEL_API_URL`
- **Type**: String
- **Required**: No (has default)
- **Description**: Duffel API base URL
- **Default**: `https://api.duffel.com`

### `HOTEL_API_URL`
- **Type**: String
- **Required**: No (has default)
- **Description**: Hotel API base URL
- **Default**: `https://api.hotelapi.co`

### `HOTEL_API_KEY`
- **Type**: String
- **Required**: No
- **Description**: Your hotel API authentication token

### `NEXT_PUBLIC_BASE_URL`
- **Type**: String
- **Required**: No (has default)
- **Description**: Your application's base URL for SEO and metadata
- **Default**: `https://globalbushtravel.com`

### `NODE_ENV`
- **Type**: String
- **Required**: No
- **Description**: Node.js environment
- **Values**: `development`, `production`, `test`

## Security Notes

1. **Never commit `.env.local` to version control**
2. **Keep your API keys secure**
3. **Use different keys for development and production**
4. **Rotate keys regularly**

## Testing

After setting up your environment variables:

1. **Test Duffel API**: Visit `/api/test-duffel` to verify Duffel API connectivity
2. **Test Location Search**: Visit `/test-cors` to test location autocomplete
3. **Test Flight Search**: Use the flight search form to test flight functionality

## Error Handling

The application will show appropriate error messages if:
- `DUFFEL_API_KEY` is missing
- API calls fail due to invalid keys
- Environment variables are not properly configured

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use production API keys (not test keys)
3. Set `NEXT_PUBLIC_BASE_URL` to your production domain
4. Ensure all required environment variables are set in your hosting platform 