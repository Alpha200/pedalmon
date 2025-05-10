FROM node:22 AS builder

WORKDIR /opt/app/

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build:prod --no-cache

FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/*
COPY nginx/app.conf /etc/nginx/conf.d
COPY --from=builder /opt/app/dist/trektales/browser /var/www
