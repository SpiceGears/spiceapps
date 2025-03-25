# Use Node.js 14 as base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY spicehub/ .
WORKDIR /app/spicehub

# Install dependencies
RUN npm install

# Copy rest of the application
# Build the Next.js application
RUN npm run build

# Expose port 3001
EXPOSE 3001

ENV PORT 3001

# Start the application
CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]
