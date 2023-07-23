# Stage 1: Build the Nuxt 3 project
FROM node:lts-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the entire project to the container
COPY . .

# Run in production mode
ENV NODE_ENV=production
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the Nuxt 3 project
RUN yarn build

# Stage 2: Serve the built files using Nginx
FROM node:lts-alpine as production

# Copy the built files from the previous stage to the NGINX directory
COPY --from=build /app/.output /app/.output

# Service hostname
ENV NUXT_HOST=0.0.0.0

# Service version
ARG NUXT_APP_VERSION
ENV NUXT_APP_VERSION=${NUXT_APP_VERSION}


# start the app
CMD [ "node", "/app/.output/server/index.mjs" ]
