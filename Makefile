
.PHONY: start-apps
start-apps: ## Start server and ui apps
	# Start the server application by going to the folder and running npm run dev
	cd server && npm install && npm run dev &
	# Start the UI application by going to the folder and running npm run dev
	cd ui && npm install --legacy-peer-deps && npm run dev &
	echo "Both applications (Server and UI) are running!"

.PHONY: stop-apps
stop-apps: ## Stop server and ui apps
	# Kill the server process (adjust based on the command you used to start it)
	pkill -f 'npm run dev' || echo "No process found"
	echo "Applications stopped!"

help:
	@echo "Available commands:"
	@printf "%-30s %s\n" "Command" "Description"
	@echo "----------------------- ------------------------------------------"
	@grep -E '^[a-zA-Z._-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'