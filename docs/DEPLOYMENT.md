# Deployment & Security Documentation

## Overview

MaxType is configured for production deployment with comprehensive security headers, Docker containerization, and optimized build processes. This document covers deployment strategies, security configurations, and production best practices.

## Security Configuration

### Security Headers

MaxType implements comprehensive security headers via Next.js configuration (`next.config.mjs`):

```javascript
async headers() {
  return [{
    // Apply security headers to all routes
    source: '/(.*)',
    headers: [
      {
        key: 'X-Frame-Options',
        value: 'DENY' // Prevent clickjacking attacks
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff' // Prevent MIME type sniffing
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin' // Control referrer information
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'off' // Disable DNS prefetching for privacy
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()' // Restrict browser features
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // PayloadCMS admin needs inline scripts
          "style-src 'self' 'unsafe-inline'", // Allow inline styles for styling
          "img-src 'self' data: blob:",
          "font-src 'self'",
          "connect-src 'self'",
          "frame-ancestors 'none'", // Prevent embedding in frames
        ].join('; ')
      }
    ]
  }]
}
```

### Security Features

#### Authentication Security

- **Rate Limiting**: 5 failed login attempts trigger 15-minute account lockout
- **Password Requirements**: Minimum 6 characters, maximum 50 characters
- **Email Verification**: Required for new accounts with 24-hour token expiry
- **Password Reset**: Secure token-based reset with 1-hour expiry
- **Session Management**: HTTP-only cookies prevent XSS attacks
- **CSRF Protection**: PayloadCMS handles CSRF tokens automatically

#### Input Validation

- **Zod Schemas**: All user inputs validated on both client and server
- **Email Validation**: Comprehensive regex patterns for email addresses
- **Username Validation**: Alphanumeric characters with dashes/underscores only
- **Password Confirmation**: Required for password changes and resets

#### Data Protection

- **User Access Control**: Users can only read/update their own data
- **Admin Privileges**: Separate admin collection with full access
- **Database Indexes**: Email and username fields indexed for performance
- **Unique Constraints**: Prevent duplicate usernames and email addresses

## Docker Configuration

### Multi-Stage Build

MaxType uses an optimized multi-stage Docker build process:

```dockerfile
# Stage 1: Dependencies
FROM node:22.12.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN [dependency installation logic]

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN [build commands]

# Stage 3: Production Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
[...production setup]
```

### Docker Features

#### Security Hardening

- **Non-root User**: Runs as `nextjs` user (UID 1001)
- **System Groups**: Uses dedicated `nodejs` group (GID 1001)
- **Alpine Linux**: Minimal attack surface with Alpine base image
- **Layer Optimization**: Multi-stage builds reduce final image size

#### Performance Optimization

- **Standalone Output**: Uses Next.js standalone mode for minimal runtime
- **Static Asset Optimization**: Separate static file handling
- **Dependency Caching**: Efficient layer caching for faster rebuilds
- **Package Manager Detection**: Supports pnpm, npm, and yarn

#### Production Configuration

```dockerfile
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
CMD HOSTNAME="0.0.0.0" node server.js
```

### Container Management

#### Running with Docker Compose

```yaml
# docker-compose.yml example setup
version: '3.8'
services:
  maxtype:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URI=${DATABASE_URI}
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
    volumes:
      - ./media:/app/media
```

## Environment Variables

### Required Variables

#### Core Application

```bash
# PayloadCMS Configuration
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com

# Database
DATABASE_URI=mongodb://localhost:27017/maxtype

# Next.js
NEXT_PUBLIC_CMS_URL=https://your-domain.com
```

#### Email Configuration (Optional)

```bash
# SMTP Settings for email verification and password reset
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USER=your-email@domain.com
MAIL_PASS=your-app-password
```

### Environment File Structure

#### Production (`.env`)

- Contains default values and non-sensitive configuration
- Committed to repository for consistency
- Used as fallback when `.env.local` is not available

#### Local Development (`.env.local`)

- Contains sensitive keys and local overrides
- **Never committed** to repository (in `.gitignore`)
- Overrides values from `.env`

#### Security Notes

- **Secrets**: Never commit sensitive data to version control
- **Key Rotation**: Regularly rotate `PAYLOAD_SECRET` and API keys
- **Access Control**: Limit environment variable access in production
- **Validation**: Validate required environment variables on startup

## Production Deployment

### Next.js Configuration

#### Standalone Output

```javascript
// next.config.mjs
const nextConfig = {
  // Enable standalone output for Docker/serverless deployment
  output: 'standalone',

  // Security headers (see Security Configuration above)
  async headers() {
    /* ... */
  },
}
```

#### Performance Optimizations

- **Automatic Static Optimization**: Next.js optimizes static pages
- **Image Optimization**: Built-in image optimization with Sharp
- **Bundle Analysis**: Use `@next/bundle-analyzer` for size optimization
- **Tree Shaking**: Unused code automatically removed

### Build Process

#### Production Build Commands

```bash
# Using pnpm (recommended)
pnpm build

# Using npm
npm run build

# Using yarn
yarn build
```

#### Build Output

- **`.next/standalone`**: Minimal server runtime
- **`.next/static`**: Static assets (CSS, JS, images)
- **`public/`**: Public static files
- **Generated Types**: PayloadCMS types in `src/payload-types.ts`

### Deployment Strategies

#### 1. Docker Deployment

```bash
# Build image
docker build -t maxtype .

# Run container
docker run -p 3000:3000 --env-file .env.local maxtype
```

#### 2. Platform Deployment (Vercel, Netlify, etc.)

- **Environment Variables**: Set via platform dashboard
- **Build Command**: `pnpm build`
- **Start Command**: `pnpm start`
- **Node Version**: 18.20.2+ or 20.9.0+

#### 3. VPS/Server Deployment

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build application
pnpm build

# Start production server
pnpm start
```

## Monitoring & Maintenance

### Health Checks

#### Application Health

- **PayloadCMS Admin**: `http://your-domain.com/admin`
- **API Endpoints**: Monitor `/api/users/me` for auth health
- **Database Connection**: Verify MongoDB connectivity

#### Performance Monitoring

- **Core Web Vitals**: Monitor LCP, FID, CLS metrics
- **API Response Times**: Track authentication and preference API calls
- **Error Rates**: Monitor for authentication failures and validation errors

### Logging & Debugging

#### Production Logging

```bash
# Disable deprecation warnings in production
NODE_OPTIONS=--no-deprecation npm start
```

#### Debug Configuration

- **Next.js Telemetry**: Optionally disable with `NEXT_TELEMETRY_DISABLED=1`
- **PayloadCMS Debug**: Use PayloadCMS built-in logging for troubleshooting
- **Error Boundaries**: Implement error boundaries for graceful error handling

### Backup & Recovery

#### Database Backups

```bash
# MongoDB backup
mongodump --uri="$DATABASE_URI" --out=./backup-$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="$DATABASE_URI" ./backup-20240101
```

#### Media File Backups

- **Local Storage**: Regular filesystem backups of `/media` directory
- **Cloud Storage**: Consider integrating with cloud storage adapters
- **Version Control**: User-uploaded media should be backed up separately

## Security Best Practices

### Regular Security Audits

1. **Dependency Updates**: Regular `pnpm audit` and dependency updates
2. **Security Headers Testing**: Use tools like securityheaders.com
3. **SSL/TLS Configuration**: Ensure proper HTTPS setup
4. **Access Log Review**: Monitor for suspicious authentication attempts

### Incident Response

1. **Account Lockout Monitoring**: Track unusual lockout patterns
2. **Failed Login Analysis**: Review authentication error patterns
3. **Database Access Monitoring**: Monitor for unusual query patterns
4. **Security Update Process**: Establish process for critical security patches

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

- **Node Version**: Ensure Node.js 18.20.2+ or 20.9.0+
- **Package Manager**: Use pnpm for consistency
- **Memory Limits**: Increase memory for large builds

#### 2. Runtime Errors

- **Environment Variables**: Verify all required variables are set
- **Database Connection**: Check MongoDB connectivity and credentials
- **File Permissions**: Ensure proper permissions for media uploads

#### 3. Authentication Issues

- **PAYLOAD_SECRET**: Verify secret key consistency
- **Cookie Domain**: Check domain configuration for authentication cookies
- **CORS Settings**: Verify cross-origin request handling

### Performance Optimization

#### 1. Database Optimization

- **Indexes**: Ensure email and username fields are indexed
- **Connection Pooling**: Optimize MongoDB connection settings
- **Query Optimization**: Review slow query logs

#### 2. Application Optimization

- **Bundle Size**: Use `@next/bundle-analyzer` to identify large bundles
- **Image Optimization**: Optimize images and use Next.js Image component
- **Caching Strategy**: Implement appropriate caching headers

#### 3. Server Optimization

- **Memory Allocation**: Allocate sufficient RAM for Node.js
- **CPU Resources**: Monitor CPU usage during peak load
- **Network Configuration**: Optimize network settings for database connections
