PROJECT_PATH := $(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))

TAG ?=  $(shell git -C "$(PROJECT_PATH)" rev-parse HEAD)
ifdef VERSION
override TAG = $(VERSION)
endif

.PHONY: install
install: ## Install project dependencies
	npm install

.PHONY: reinstall
reinstall: ## Reinstall project dependencies, delete the node_modules folder and recreate
	rm -rf node_modules
	make install

.PHONY: build
build: ## Build the application
	npm run build

.PHONY: start
start: build ## Start the application after building
	npm run start

.PHONY: dev
dev: ## Run the application in development mode
	npm run dev

.PHONY: test
test: ## Run tests
	npm run test

.PHONY: clean
clean: ## Clean the build artifacts
	rm -rf dist

help:
	@echo "Available commands:"
	@printf "%-30s %s\n" "Command" "Description"
	@echo "----------------------- ------------------------------------------"
	@grep -E '^[a-zA-Z._-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'