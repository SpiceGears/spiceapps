#!/bin/bash

# Function to handle cleanup on script termination
cleanup() {
    echo "Shutting down services..."
    kill $(jobs -p)
    exit
}

# Set up trap for script termination
trap cleanup SIGINT SIGTERM

# Start Next.js frontend
echo "Starting Next.js frontend on port 80..."
#cd spicelab
#npm run dev -- -p 80 &
#cd ..

# Start ASP.NET backend
echo "Starting ASP.NET backend on port 8080..."
cd spiceapi
docker build -t spiceapi .
cd ..
docker compose up

# Wait for both processes
wait
