# Use Node.js 24 as base image
FROM node:24-alpine

# Create app directory
WORKDIR /app

COPY spicehub/ .

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy rest of the application
# Build the Next.js application
# NOTE: Uncomment for release
#RUN npm run build

# Expose port 3000
EXPOSE 3000

ENV PORT=3000

# Start the application
# NOTE: Use npm start instead on release
#CMD ["npm", "start"]
 CMD ["npm", "run", "dev"]
