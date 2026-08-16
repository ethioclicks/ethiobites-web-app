# EthoBites Web App - Deployment Guide

This guide provides comprehensive instructions for deploying the EthoBites web application to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: 18.0 or higher
- **Docker**: 20.10 or higher (for containerized deployment)
- **Docker Compose**: 2.0 or higher
- **RAM**: Minimum 2GB, Recommended 4GB
- **Storage**: Minimum 10GB available space
- **Network**: HTTPS-capable domain (for production)

### External Services

1. **Spring Boot Backend API**
   - EthoBites backend service running on port 8080 (or configured port)
   - Database connection established
   - API endpoints accessible

2. **Firebase Services**
   - Firebase project configured
   - Authentication enabled
   - Storage bucket created for file uploads

3. **SSL Certificate** (Production)
   - Valid SSL certificate for your domain
   - Certificate files accessible to nginx container

## Environment Configuration

### 1. Create Environment File

Copy the production environment template:

```bash
cp .env.production .env.local
```

### 2. Configure Variables

Update `.env.local` with your production values:

```env
# Application
NODE_ENV=production

# API Configuration
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# NextAuth Configuration
NEXTAUTH_URL=https://app.your-domain.com
NEXTAUTH_SECRET=your-super-secure-secret-key-at-least-32-characters-long

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-production-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-production-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Security Configuration

Ensure these security measures are in place:

- Strong, unique `NEXTAUTH_SECRET` (32+ characters)
- Firebase security rules configured
- API CORS settings properly configured
- Rate limiting enabled on the API

## Docker Deployment

### Quick Deployment

Use the provided deployment script:

```bash
# Simple deployment
./scripts/deploy.sh

# Or with Docker Compose
./scripts/deploy.sh compose
```

### Manual Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t ethobites/web-app:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name ethobites-web \
     -p 3000:3000 \
     --env-file .env.local \
     --restart unless-stopped \
     ethobites/web-app:latest
   ```

3. **Verify deployment**:
   ```bash
   curl http://localhost:3000/api/health
   ```

### Docker Compose Deployment

For production with nginx reverse proxy:

```bash
# Start all services
docker-compose --profile production up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Manual Deployment

### 1. Install Dependencies

```bash
npm ci --only=production
```

### 2. Build Application

```bash
npm run build
```

### 3. Start Application

```bash
npm start
```

### 4. Process Management (Optional)

Use PM2 for process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "ethiopromo-web" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## Production Checklist

### Pre-Deployment

- [ ] Environment variables configured and secure
- [ ] SSL certificates obtained and configured
- [ ] Firebase project configured for production
- [ ] Backend API accessible from production environment
- [ ] Domain DNS configured correctly
- [ ] Firewall rules configured (ports 80, 443, 22)

### Security Checklist

- [ ] HTTPS enabled and HTTP redirects configured
- [ ] Security headers implemented (CSP, HSTS, etc.)
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Authentication flow tested
- [ ] File upload restrictions in place
- [ ] Error messages don't expose sensitive information

### Performance Checklist

- [ ] Image optimization enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] Caching headers configured
- [ ] CDN configured (optional)
- [ ] Database queries optimized
- [ ] Bundle size analyzed and optimized

### Testing Checklist

- [ ] Health check endpoint responding
- [ ] Authentication flow working
- [ ] User registration working
- [ ] Profile management working
- [ ] Password reset flow working
- [ ] File uploads working
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility tested

## Monitoring and Maintenance

### Health Monitoring

The application provides a health check endpoint:

```bash
curl https://your-domain.com/api/health
```

Response format:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "memory": {
    "used": 150.5,
    "total": 256.0,
    "external": 25.3
  }
}
```

### Logging

Application logs are available via:

```bash
# Docker logs
docker logs ethobites-web

# Docker Compose logs
docker-compose logs ethobites-web

# PM2 logs
pm2 logs ethobites-web
```

### Backup Strategy

1. **Environment Configuration**
   - Backup `.env.local` securely
   - Store in encrypted format

2. **SSL Certificates**
   - Backup certificate files
   - Set renewal reminders

3. **Application Data**
   - User uploaded files (Firebase Storage)
   - Database backups (handled by backend)

### Updates and Maintenance

1. **Application Updates**:
   ```bash
   # Pull latest code
   git pull origin main
   
   # Rebuild and deploy
   ./scripts/deploy.sh
   ```

2. **Security Updates**:
   ```bash
   # Update dependencies
   npm audit fix
   
   # Rebuild Docker image
   docker build --no-cache -t ethiopromo/web-app:latest .
   ```

3. **SSL Certificate Renewal**:
   ```bash
   # Renew certificates (example with Let's Encrypt)
   certbot renew
   
   # Restart nginx
   docker-compose restart nginx
   ```

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

**Symptoms**: Container exits immediately or health check fails

**Solutions**:
```bash
# Check logs
docker logs ethobites-web

# Check environment variables
docker exec ethobites-web env

# Verify port availability
netstat -tulpn | grep :3000
```

#### 2. Authentication Not Working

**Symptoms**: Login fails or redirects incorrectly

**Solutions**:
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set and secure
- Ensure backend API is accessible
- Check Firebase configuration

#### 3. File Uploads Failing

**Symptoms**: Profile picture uploads fail

**Solutions**:
- Verify Firebase Storage configuration
- Check Firebase security rules
- Ensure storage bucket exists and is accessible
- Check file size limits

#### 4. High Memory Usage

**Symptoms**: Container using excessive memory

**Solutions**:
```bash
# Check memory usage
docker stats ethobites-web

# Restart container
docker restart ethobites-web

# Check for memory leaks in logs
docker logs ethobites-web | grep -i "memory\|heap"
```

### Performance Issues

#### 1. Slow Page Load Times

**Solutions**:
- Enable compression in nginx
- Optimize images and static assets
- Check backend API response times
- Enable browser caching

#### 2. High CPU Usage

**Solutions**:
- Check for infinite loops in logs
- Monitor concurrent user connections
- Scale horizontally if needed
- Optimize database queries (backend)

### Emergency Procedures

#### 1. Rollback to Previous Version

```bash
# Stop current container
docker stop ethobites-web

# Run previous image version
docker run -d \
  --name ethobites-web \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  ethobites/web-app:PREVIOUS_TAG
```

#### 2. Emergency Maintenance Mode

Create a maintenance page and redirect traffic:

```nginx
# Add to nginx configuration
location / {
    return 503;
}

error_page 503 /maintenance.html;
location = /maintenance.html {
    root /usr/share/nginx/html;
}
```

## Support

For additional support:

- **Documentation**: Check this deployment guide and README.md
- **Logs**: Review application and container logs
- **Health Check**: Monitor `/api/health` endpoint
- **Backend Issues**: Check EthoBites backend service logs
- **Firebase Issues**: Check Firebase console for errors

## Security Considerations

- Keep dependencies updated with `npm audit`
- Regularly rotate secrets and API keys
- Monitor for security vulnerabilities
- Implement proper backup and disaster recovery
- Use strong SSL/TLS configuration
- Enable security monitoring and alerting