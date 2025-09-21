#!/bin/bash

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Create standalone static directory if it doesn't exist
echo "Setting up static files for standalone build..."
mkdir -p .next/standalone/.next/static

# Copy static files to standalone build
if [ -d ".next/static" ]; then
    cp -r .next/static/* .next/standalone/.next/static/
    echo "Static files copied successfully!"
else
    echo "Warning: No static files found to copy"
fi

# Copy public files to standalone build
if [ -d "public" ]; then
    mkdir -p .next/standalone/public
    cp -r public/* .next/standalone/public/
    echo "Public files copied successfully!"
fi

echo "Standalone build preparation complete!"