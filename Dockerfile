# ===============================
# Build stage
# ===============================
FROM node:20-alpine AS build

WORKDIR /app

# Copy only dependency manifests first (better cache usage)
COPY package.json package-lock.json ./

# Install dependencies (including dev deps for Vite)
RUN npm ci --include=dev

# Copy application source
COPY . .

# Build frontend (Vite → dist/)
RUN npm run build


# ===============================
# Runtime stage
# ===============================
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
