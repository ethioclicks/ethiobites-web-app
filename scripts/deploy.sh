#!/bin/bash

# EthoBites Web App Deployment Script
# This script helps deploy the application to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ethobites-web-app"
DOCKER_IMAGE_NAME="ethobites/web-app"
CONTAINER_NAME="ethobites-web"
NETWORK_NAME="ethobites-network"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        log_warn ".env.local file not found. Please create it from .env.example"
        log_info "Creating .env.local from .env.production template..."
        cp .env.production .env.local
        log_warn "Please update .env.local with your production values before continuing."
        exit 1
    fi
    
    log_info "All requirements satisfied."
}

build_image() {
    log_info "Building Docker image..."
    
    # Build the Docker image
    docker build -t $DOCKER_IMAGE_NAME:latest -t $DOCKER_IMAGE_NAME:$(date +%Y%m%d-%H%M%S) .
    
    log_info "Docker image built successfully."
}

deploy_application() {
    log_info "Deploying application..."
    
    # Create network if it doesn't exist
    docker network create $NETWORK_NAME 2>/dev/null || log_info "Network $NETWORK_NAME already exists"
    
    # Stop existing container if running
    if docker ps -a --format 'table {{.Names}}' | grep -q $CONTAINER_NAME; then
        log_info "Stopping existing container..."
        docker stop $CONTAINER_NAME 2>/dev/null || true
        docker rm $CONTAINER_NAME 2>/dev/null || true
    fi
    
    # Run the new container
    docker run -d \
        --name $CONTAINER_NAME \
        --network $NETWORK_NAME \
        -p 3000:3000 \
        --env-file .env.local \
        --restart unless-stopped \
        --health-cmd "curl -f http://localhost:3000/api/health || exit 1" \
        --health-interval 30s \
        --health-timeout 10s \
        --health-retries 3 \
        $DOCKER_IMAGE_NAME:latest
    
    log_info "Container started successfully."
}

deploy_with_compose() {
    log_info "Deploying with Docker Compose..."
    
    # Use docker-compose if available, otherwise use docker compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        COMPOSE_CMD="docker compose"
    fi
    
    # Deploy with compose
    $COMPOSE_CMD up -d --build
    
    log_info "Application deployed with Docker Compose."
}

health_check() {
    log_info "Performing health check..."
    
    # Wait for the application to start
    sleep 10
    
    # Check if the container is running
    if ! docker ps --format 'table {{.Names}}' | grep -q $CONTAINER_NAME; then
        log_error "Container is not running!"
        return 1
    fi
    
    # Check application health
    for i in {1..10}; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            log_info "Health check passed!"
            return 0
        fi
        log_info "Waiting for application to start... (attempt $i/10)"
        sleep 5
    done
    
    log_error "Health check failed!"
    return 1
}

cleanup() {
    log_info "Cleaning up old images..."
    
    # Remove old images (keep last 3 versions)
    docker images $DOCKER_IMAGE_NAME --format "table {{.Tag}}\t{{.ID}}" | \
        grep -E "^[0-9]{8}-[0-9]{6}" | \
        sort -r | \
        tail -n +4 | \
        awk '{print $2}' | \
        xargs -r docker rmi 2>/dev/null || true
    
    log_info "Cleanup completed."
}

show_help() {
    echo "EthoBites Web App Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  build           Build Docker image only"
    echo "  deploy          Build and deploy using Docker run"
    echo "  compose         Deploy using Docker Compose"
    echo "  health          Check application health"
    echo "  cleanup         Remove old Docker images"
    echo "  logs            Show application logs"
    echo "  stop            Stop the application"
    echo "  restart         Restart the application"
    echo "  help            Show this help message"
    echo ""
}

show_logs() {
    log_info "Showing application logs..."
    docker logs -f $CONTAINER_NAME
}

stop_application() {
    log_info "Stopping application..."
    docker stop $CONTAINER_NAME 2>/dev/null || log_warn "Container not running"
    log_info "Application stopped."
}

restart_application() {
    log_info "Restarting application..."
    docker restart $CONTAINER_NAME 2>/dev/null || log_error "Failed to restart container"
    log_info "Application restarted."
}

# Main execution
case "${1:-deploy}" in
    "build")
        check_requirements
        build_image
        ;;
    "deploy")
        check_requirements
        build_image
        deploy_application
        health_check
        log_info "Deployment completed successfully!"
        log_info "Application is available at: http://localhost:3000"
        ;;
    "compose")
        check_requirements
        deploy_with_compose
        health_check
        log_info "Deployment completed successfully!"
        log_info "Application is available at: http://localhost:3000"
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_application
        ;;
    "restart")
        restart_application
        ;;
    "help")
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac