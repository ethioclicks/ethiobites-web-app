# EthoBites Web Application

A modern, responsive web application built with Next.js 15, TypeScript, and Tailwind CSS, designed to complement the EthoBites Spring Boot backend and mobile applications.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/logout with NextAuth.js
- **User Registration** - Multi-step registration with validation and address input
- **Profile Management** - Complete profile editing with profile picture uploads
- **Password Management** - Secure password reset and account recovery
- **Dashboard & Navigation** - Responsive dashboard with modern navigation
- **Account Management** - Account deactivation and reactivation features

### Technical Features
- **TypeScript** - Full type safety and developer experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Ethiopian Localization** - Ethiopian phone number formatting and city selection
- **Firebase Integration** - File storage and authentication
- **Spring Boot Integration** - Seamless API integration with backend
- **Production Ready** - Docker support, security headers, and optimization

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **File Storage**: Firebase Storage
- **HTTP Client**: Axios
- **Form Validation**: Custom validation with error handling
- **Deployment**: Docker & Docker Compose
- **Backend Integration**: Spring Boot REST API

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm
- Docker (for containerized deployment)
- Firebase project (for file storage)
- EthoBites Spring Boot backend running

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ethobites-web-app
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
ethobites-web-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   └── health/               # Health check endpoint
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── forgot-password/      # Password reset request
│   │   ├── reset-password/       # Password reset form
│   │   └── reactivate/           # Account reactivation
│   ├── dashboard/                # User dashboard
│   ├── profile/                  # User profile management
│   ├── components/               # Component showcase
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard-specific components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   ├── navigation/               # Navigation components
│   ├── profile/                  # Profile components
│   └── ui/                       # Base UI components
├── lib/                          # Utility libraries
│   ├── api/                      # API client and functions
│   ├── auth/                     # Authentication configuration
│   ├── firebase.ts               # Firebase configuration
│   └── utils.ts                  # Utility functions
├── types/                        # TypeScript type definitions
├── scripts/                      # Deployment and utility scripts
├── public/                       # Static assets
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose configuration
├── nginx.conf                    # Nginx configuration
└── DEPLOYMENT.md                 # Deployment documentation
```

## 🎨 Design System

The application features a comprehensive design system with:

- **Ethiopian-inspired color palette** - Warm, vibrant colors
- **Responsive components** - Mobile-first design approach
- **Consistent typography** - Optimized for readability
- **Accessible UI** - WCAG-compliant components
- **Glass morphism effects** - Modern visual effects
- **Micro-interactions** - Enhanced user experience

### Color Scheme

```css
/* Primary Colors */
--primary-50: #fef7f0;
--primary-500: #c0392b;  /* Ethiopian red */
--primary-600: #a93226;

/* Secondary Colors */
--secondary-500: #f1c40f;  /* Ethiopian gold */
--secondary-600: #d4ac0d;

/* Text Colors */
--text-primary: #2d3748;
--text-secondary: #718096;
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking

# Production
npm run preview         # Build and preview production
npm run deploy          # Deploy with Docker
npm run health-check    # Check application health

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
```

## 🔐 Authentication Flow

The application implements a comprehensive authentication system:

1. **Login** - Phone number and password authentication
2. **Registration** - Multi-step user registration with validation
3. **Password Reset** - Email-based password recovery
4. **Account Management** - Profile updates and account deactivation
5. **Session Management** - Secure session handling with NextAuth.js

### Authentication Pages

- `/auth/login` - User login
- `/auth/register` - User registration (multi-step)
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset form (token-based)
- `/auth/reactivate` - Account reactivation request

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first approach** - Optimized for mobile devices
- **Tablet optimization** - Enhanced for tablet experiences
- **Desktop enhancement** - Rich desktop features
- **Touch-friendly** - Optimized for touch interactions
- **Keyboard navigation** - Full keyboard accessibility

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Quick deployment
./scripts/deploy.sh

# With Docker Compose (includes nginx)
./scripts/deploy.sh compose

# Manual Docker build
docker build -t ethiopromo/web-app .
docker run -p 3000:3000 --env-file .env.local ethiopromo/web-app
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔒 Security

The application implements comprehensive security measures:

- **HTTPS enforcement** - All connections encrypted
- **Security headers** - CSP, HSTS, XSS protection
- **Input validation** - Client and server-side validation
- **Rate limiting** - API request rate limiting
- **Authentication security** - Secure session management
- **File upload security** - Safe file handling with Firebase

## 📊 Performance

The application is optimized for performance:

- **Next.js optimization** - Automatic code splitting and optimization
- **Image optimization** - WebP/AVIF format support
- **Bundle analysis** - Webpack bundle optimization
- **Caching strategy** - Static asset and API response caching
- **Compression** - Gzip/Brotli compression enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use the established component patterns
- Maintain responsive design principles
- Write clear, descriptive commit messages
- Test all user flows before submitting

## 📝 License

This project is part of the EthioPromo application suite. All rights reserved.

## 🆘 Support

For support and questions:

- Check the [Deployment Guide](./DEPLOYMENT.md) for deployment issues
- Review application logs for error diagnosis
- Contact the development team for technical support

---

**EthoBites Web Application** - Built with ❤️ for the Ethiopian community