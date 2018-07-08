.PHONE: dep
dep:
	@ cd project/static/js && \
		npm install

.PHONE: lint
lint:
	@ eslint ./project/static/js/src

.PHONE: build
build:
	@ cd project/static/js && \
		./node_modules/webpack/bin/webpack.js

.PHONE: run
run:
	@ caddy
