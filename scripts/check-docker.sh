#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running or is paused."
  echo ""
  echo "Please:"
  echo "  1. Open Docker Desktop"
  echo "  2. Unpause Docker Desktop (click the whale icon in the menu bar)"
  echo "  3. Wait for Docker to start, then try again"
  echo ""
  exit 1
fi

# Check if Docker daemon is accessible
if ! docker ps > /dev/null 2>&1; then
  echo "❌ Docker daemon is not accessible."
  echo ""
  echo "Please check Docker Desktop status and try again."
  echo ""
  exit 1
fi

exit 0
