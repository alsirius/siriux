#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DOCS_DIR="$PROJECT_ROOT/../../packages/docs"

# Default environment and target
ENV="prod"
TARGET="both"  # Can be "frontend", "backend", or "both"

# Function to show help
show_help() {
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./rebuild-servers.sh [mode] [environment] [target]"
    echo
    echo -e "${YELLOW}Modes:${NC}"
    echo "  1, restart   - Just restart servers"
    echo "  2, rebuild   - Rebuild and restart servers"
    echo "  3, clean     - Full clean, rebuild, and restart"
    echo "  -h, --help   - Show this help message"
    echo
    echo -e "${YELLOW}Environment:${NC}"
    echo "  dev         - Use development environment"
    echo "  prod        - Use production environment [default]"
    echo
    echo -e "${YELLOW}Target:${NC}"
    echo "  -f, --frontend  - Only process frontend"
    echo "  -b, --backend   - Only process backend"
    echo "  -d, --docs      - Only process docs"
    echo "  (none)          - Process all servers [default]"
}

# Function to check if a port is in use
is_port_in_use() {
    local port=$1
    lsof -ti :$port >/dev/null
    return $?
}

# Function to kill processes on ports
kill_port() {
    local port=$1
    local pid=$(lsof -ti :$port)
    if [ ! -z "$pid" ]; then
        echo -e "${RED}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid
        sleep 2
    fi
}

# Function to restart servers
restart_servers() {
    local target=$1
    echo -e "${BLUE}Restarting servers for target: $target...${NC}"

    if [[ "$target" == "both" || "$target" == "backend" ]]; then
        # Start backend
        echo -e "${BLUE}Starting backend server...${NC}"
        cd "$BACKEND_DIR"
        kill_port 8000
        npm start &
        sleep 2
    fi

    if [[ "$target" == "both" || "$target" == "frontend" ]]; then
        # Start frontend
        echo -e "${BLUE}Starting frontend server...${NC}"
        cd "$FRONTEND_DIR"
        kill_port 3000
        ./scripts/build-prod.sh
        npm start &
        sleep 2
    fi

    if [[ "$target" == "both" || "$target" == "docs" ]]; then
        # Start docs
        echo -e "${BLUE}Starting docs server...${NC}"
        cd "$DOCS_DIR"
        kill_port 5173
        npm run dev &
        sleep 2
    fi

    echo -e "${GREEN}Servers restarted${NC}"
}

# Function to rebuild servers
rebuild_servers() {
    local target=$1
    echo -e "${BLUE}Rebuilding servers for target: $target...${NC}"

    if [[ "$target" == "both" || "$target" == "backend" ]]; then
        # Backend
        cd "$BACKEND_DIR"
        echo -e "${BLUE}Installing backend dependencies...${NC}"
        npm install
        if [ "$ENV" = "prod" ]; then
            echo -e "${BLUE}Building backend for production...${NC}"
            npm run build
        fi
    fi

    if [[ "$target" == "both" || "$target" == "frontend" ]]; then
        # Frontend
        cd "$FRONTEND_DIR"
        echo -e "${BLUE}Installing frontend dependencies...${NC}"
        npm install
        if [ "$ENV" = "prod" ]; then
            echo -e "${BLUE}Building frontend for production...${NC}"
            npm run build
        fi
    fi

    if [[ "$target" == "both" || "$target" == "docs" ]]; then
        # Docs
        cd "$DOCS_DIR"
        echo -e "${BLUE}Installing docs dependencies...${NC}"
        npm install
        if [ "$ENV" = "prod" ]; then
            echo -e "${BLUE}Building docs for production...${NC}"
            npm run build
        fi
    fi

    echo -e "${GREEN}Rebuild complete${NC}"
}

# Function to clean everything
clean_all() {
    local target=$1
    echo -e "${BLUE}Performing cleanup for target: $target...${NC}"

    if [[ "$target" == "both" || "$target" == "backend" ]]; then
        # Backend cleanup
        echo -e "${BLUE}Cleaning backend...${NC}"
        cd "$BACKEND_DIR"
        rm -rf node_modules dist package-lock.json .next
    fi

    if [[ "$target" == "both" || "$target" == "frontend" ]]; then
        # Frontend cleanup
        echo -e "${BLUE}Cleaning frontend...${NC}"
        cd "$FRONTEND_DIR"
        rm -rf node_modules .next out package-lock.json
    fi

    if [[ "$target" == "both" || "$target" == "docs" ]]; then
        # Docs cleanup
        echo -e "${BLUE}Cleaning docs...${NC}"
        cd "$DOCS_DIR"
        rm -rf node_modules package-lock.json docs/.vitepress/dist
    fi

    echo -e "${GREEN}Cleanup complete${NC}"
}

# Parse command line arguments
MODE="$1"
ENV_ARG="$2"

# Set environment based on argument
if [ "$ENV_ARG" = "dev" ]; then
    ENV="dev"
elif [ "$ENV_ARG" = "prod" ]; then
    ENV="prod"
fi

# Parse target argument
case "$3" in
    "-f"|"--frontend")
        TARGET="frontend"
        ;;
    "-b"|"--backend")
        TARGET="backend"
        ;;
    "-d"|"--docs")
        TARGET="docs"
        ;;
    "")
        TARGET="both"
        ;;
    *)
        echo -e "${RED}Invalid target: $3${NC}"
        show_help
        exit 1
        ;;
esac

# Main logic
case "$MODE" in
    "1"|"restart")
        restart_servers "$TARGET"
        ;;

    "2"|"rebuild")
        rebuild_servers "$TARGET"
        restart_servers "$TARGET"
        ;;

    "3"|"clean")
        clean_all "$TARGET"
        rebuild_servers "$TARGET"
        restart_servers "$TARGET"
        ;;

    "-h"|"--help"|"")
        show_help
        exit 0
        ;;

    *)
        echo -e "${RED}Invalid mode: $MODE${NC}"
        show_help
        exit 1
        ;;
esac

# Final status check
echo -e "\n${BLUE}Server Status:${NC}"
echo -e "${GREEN}Process complete!${NC}"
echo -e "Environment: $ENV"
echo -e "Target: $TARGET"

if [ "$ENV" = "dev" ]; then
    [[ "$TARGET" == "both" || "$TARGET" == "backend" ]] && echo -e "Backend URL: http://localhost:8000"
    [[ "$TARGET" == "both" || "$TARGET" == "frontend" ]] && echo -e "Frontend URL: http://localhost:3000"
    [[ "$TARGET" == "both" || "$TARGET" == "docs" ]] && echo -e "Docs URL: http://localhost:5173"
else
    [[ "$TARGET" == "both" || "$TARGET" == "backend" ]] && echo -e "Backend URL: http://localhost:8000"
    [[ "$TARGET" == "both" || "$TARGET" == "frontend" ]] && echo -e "Frontend URL: http://localhost:3000"
    [[ "$TARGET" == "both" || "$TARGET" == "docs" ]] && echo -e "Docs URL: http://localhost:5173"
fi
