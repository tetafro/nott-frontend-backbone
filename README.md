# Nott

[![CircleCI](https://circleci.com/gh/tetafro/nott-frontend-backbone.svg?style=shield)](https://circleci.com/gh/tetafro/nott-frontend-backbone)

Markdown notes service with code syntax highlighting.

This repository provides frontend written with Backbone.js framework.

## Build and run

Prerequisites:

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
