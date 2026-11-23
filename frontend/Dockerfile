
FROM node:20-alpine AS build

WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV NODE_ENV=development
ENV NODE_PATH=/app/frontend/node_modules

# Copy npm workspace manifests
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

# Install frontend dependencies, including devDependencies
RUN npm ci --workspace=frontend --include-workspace-root=false --include=dev

# Copy frontend source
COPY frontend ./frontend

# Verify Tailwind CSS is available
RUN npm ls tailwindcss --workspace=frontend
RUN node -e "console.log(require.resolve('tailwindcss', { paths: ['/app/frontend'] }))"

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Production image
FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
