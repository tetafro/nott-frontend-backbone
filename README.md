# Nott

Markdown notes service with code syntax highlighting.

This repository provides frontend.

## Build and run

Prerequiresites:

* Install [Caddy web server](https://caddyserver.com/download)
* Install webpack

Install dependencies
```sh
make dep
```

Create and populate config
```sh
cp .env.example .env
source .env
```

Build and run the application
```sh
make build run
```
