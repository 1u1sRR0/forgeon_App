# OAuth Authentication Setup Guide

This guide explains how to configure OAuth providers (Google, GitHub, Apple) for the authentication system.

## Overview

The application now supports multiple authentication methods:
- **Email/Password** (Credentials) - Existing functionality
- **Google OAuth** - Sign in with Google account
- **GitHub OAuth** - Sign in with GitHub account
- **Apple OAuth** - Sign in with Apple ID

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Apple OAuth
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"
```

## Setting Up OAuth Providers

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env` file

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret
6. Add both to your `.env` file

### Apple OAuth

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new "Services ID"
4. Configure Sign in with Apple:
   - Add your domain and return URLs
   - Return URL: `http://localhost:3000/api/auth/callback/apple`
5. Generate a private key for Sign in with Apple
6. Copy the Service ID (Client ID) and configure the Client Secret
7. Add both to your `.env` file

**Note:** Apple OAuth setup is more complex and requires a paid Apple Developer account.

## Testing OAuth Locally

1. Ensure all environment variables are set in your `.env` file
2. Restart your development server: `npm run dev`
3. Navigate to `/login` or `/register`
4. Click on any OAuth provider button
5. Complete the OAuth flow in the provider's authentication page
6. You should be redirected back to `/dashboard` upon success

## OAuth Flow

1. User clicks "Continue with [Provider]" button
2. Application redirects to provider's OAuth consent page
3. User authorizes the application
4. Provider redirects back to `/api/auth/callback/[provider]`
5. NextAuth creates or updates the user account
6. User is redirected to `/dashboard` with an active session

## Database Schema

The existing Prisma schema already supports OAuth through the `Account` model:

```prisma
model Account {
  id                String  @id
  userId            String
  type              String
  provider          String  // 'google', 'github', 'apple', or 'credentials'
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  // ... other OAuth fields
}
```

No database migrations are required for basic OAuth functionality.

## Troubleshooting

### OAuth buttons not working

- Check that environment variables are set correctly
- Verify redirect URIs match exactly in provider settings
- Check browser console for error messages
- Ensure `NEXTAUTH_URL` matches your current domain

### "Provider not configured" errors

- Verify the provider's Client ID and Secret are in `.env`
- Restart the development server after adding environment variables
- Check for typos in environment variable names

### Users can't sign in after OAuth

- Verify the `Account` model exists in your Prisma schema
- Run `npx prisma generate` to update Prisma client
- Check database connection is working

## Security Notes

- Never commit `.env` files to version control
- Use different OAuth credentials for development and production
- Rotate secrets regularly
- Enable 2FA on your OAuth provider accounts
- Review OAuth scopes to request only necessary permissions

## Features

- **Account Linking**: Users can link multiple OAuth providers to one account
- **Backward Compatible**: Existing email/password authentication still works
- **Graceful Degradation**: If OAuth providers aren't configured, credential auth still functions
- **Dark Theme**: Modern glassmorphism UI matching the landing page design
- **Responsive**: Works on mobile, tablet, and desktop devices
- **Accessible**: Keyboard navigation and screen reader support

## Next Steps

1. Configure OAuth providers in their respective developer consoles
2. Add environment variables to your `.env` file
3. Test each OAuth provider locally
4. Configure production OAuth credentials before deploying
5. Update OAuth redirect URIs for production domain
