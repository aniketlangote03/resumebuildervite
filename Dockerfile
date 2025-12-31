# ===============================
# Build stage
# ===============================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# IMPORTANT: install devDependencies so Vite exists
RUN npm ci --include=dev

# Copy application source
COPY . .

# Build frontend
RUN npm run build


# ===============================
# Runtime stage
# ===============================
FROM nginx:1.27-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
