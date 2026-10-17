# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --omit=dev

# COPY . .

# RUN mkdir -p logs

# ENV NODE_ENV=production
# EXPOSE 5000

# CMD ["node", "server.js"]



FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p logs

# Run as a non-root user instead of the default root, so a code-execution
# bug in the app doesn't hand an attacker root inside the container.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]