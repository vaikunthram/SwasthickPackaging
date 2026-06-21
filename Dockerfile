# check=skip=SecretsUsedInArgOrEnv

# Stage 1: Build stage to generate config.js using Node.js
FROM node:18-alpine AS builder
WORKDIR /app

# Copy configuration files and scripts
COPY package.json build.js config.example.js ./

# Read the build argument for the access key and generate config.js
ARG WEB3FORMS_ACCESS_KEY
ENV WEB3FORMS_ACCESS_KEY=$WEB3FORMS_ACCESS_KEY
RUN npm run build

# Stage 2: Serve stage using Nginx
FROM nginx:alpine

# Copy all static website assets from the root of the project
COPY . /usr/share/nginx/html/

# Copy the generated config.js from Stage 1 to overwrite any placeholder
COPY --from=builder /app/config.js /usr/share/nginx/html/config.js

# Expose Nginx default port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

