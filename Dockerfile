FROM alpine

# Installs latest Chromium (92) package.
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  NODE_ENV=production \
  PORT=8080

USER root
WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
EXPOSE 8080
CMD ["yarn" , "start"]