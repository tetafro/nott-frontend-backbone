FROM alpine:3.7 AS build-caddy

WORKDIR /build

RUN apk add --no-cache wget ca-certificates && \
    wget -q -O caddy.tar.gz https://caddyserver.com/download/linux/amd64?license=personal && \
    tar -xzf caddy.tar.gz

FROM tetafro/webpack:8 AS build-app

WORKDIR /build

COPY project/static/js .

RUN webpack

FROM alpine:3.7

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=build-caddy /build/caddy /usr/local/bin/caddy
COPY Caddyfile /etc/

COPY --from=build-app /build/app.min.js static/js/
COPY project/static/css static/css
COPY project/static/fonts static/fonts
COPY project/static/images static/images
COPY project/index.html .

RUN mkdir .well-known && \
    chmod u+x /usr/local/bin/caddy

EXPOSE 80 443 2015

CMD ["caddy", "-agree", "-conf", "/etc/Caddyfile"]