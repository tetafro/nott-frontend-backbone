.PHONY: dep
dep:
	@ cd project/static/js && \
		npm install

.PHONY: lint
lint:
	@ eslint ./project/static/js/src

.PHONY: build
build:
	@ cd project/static/js && \
		./node_modules/webpack/bin/webpack.js

.PHONY: run
run:
	@ caddy

.PHONY: docker
docker:
	docker build -t tetafro/nott-frontend-backbone .
