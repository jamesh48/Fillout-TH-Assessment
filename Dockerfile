# Install dependencies only when needed
FROM node:lts-alpine AS deps

WORKDIR /opt/fillout-app
COPY package*.json ./
RUN npm ci

FROM node:lts-alpine AS builder
WORKDIR /opt/fillout-app
COPY . .
COPY --from=deps /opt/fillout-app/node_modules ./node_modules
RUN npm run build

FROM node:lts-alpine as runner
ARG X_TAG
WORKDIR /opt/fillout-app
ENV NODE_ENV=production
COPY --from=builder /opt/fillout-app/dist ./dist
COPY --from=builder /opt/fillout-app/package*.json ./
COPY --from=builder /opt/fillout-app/node_modules ./node_modules

EXPOSE 3500
ENV PORT 3500
CMD ["npm", "start"]