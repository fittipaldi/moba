
.PHONY: start-apps
start-apps: ## Start server and ui apps
	# Start the server application by going to the folder and running npm run dev
	cd server && npm install && npm run dev &
	# Start the UI application by going to the folder and running npm run dev
	cd ui && npm install --legacy-peer-deps && npm run dev &
	echo "Both applications (Server and UI) are running!"

.PHONY: kill-apps
kill-apps: ## Kill server and ui apps
	# Kill all processes related to "node" or "moba"
	ps aux | grep -E 'node|moba' | grep -v grep | awk '{print $$2}' | xargs kill -9 || echo "No matching processes found"
	echo "Applications stopped!"

.PHONY: start-ngrok
start-ngrok: ## Start Ngrok
	# Start ngrok with the specified URL and port
	ngrok http --url=lynx-devoted-mutt.ngrok-free.app 81

help:
	@echo "Available commands:"
	@printf "%-30s %s\n" "Command" "Description"
	@echo "----------------------- ------------------------------------------"
	@grep -E '^[a-zA-Z._-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'