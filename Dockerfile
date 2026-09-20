# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files first (better layer caching)
COPY package*.json ./

RUN npm install --production

# Copy the rest of the app code
COPY . .

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed from the build stage
COPY --from=build /app /app

# Run as a non-root user (security best practice)
USER node

EXPOSE 3000

CMD ["node", "app.js"]