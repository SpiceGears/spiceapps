# Use Node.js 24 as base image
FROM node:24-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY spicehub/ .
WORKDIR /app/spicehub

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the application
# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

ENV PORT=3000

# Start the application
CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]
