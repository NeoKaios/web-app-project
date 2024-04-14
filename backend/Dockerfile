FROM node:18-alpine
# dockerize : wait for DB to be available
ENV DOCKERIZE_VERSION v0.7.0
RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget
WORKDIR '/app'
COPY . .
RUN npm install
EXPOSE 4000
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ./docker-entrypoint.sh
