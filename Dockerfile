FROM tetafro/caddy:0.11.4

WORKDIR /app

COPY Caddyfile /etc/
COPY project/static/js/app.min.js static/js/
COPY project/static/css static/css
COPY project/static/fonts static/fonts
COPY project/static/images static/images
COPY project/index.html .

EXPOSE 8080

CMD ["-agree", "-conf", "/etc/Caddyfile"]
