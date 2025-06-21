FROM node:18-alpine AS build
WORKDIR /app

# Copy package files first for better caching
COPY package.json vite.config.js index.html ./
RUN npm install --no-cache

# Copy source files
COPY public ./public
COPY src ./src

# Debug build
RUN echo "Node version: $(node -v)"
RUN echo "NPM version: $(npm -v)"
RUN npm list

# Build the app
RUN npm run build --verbose

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
