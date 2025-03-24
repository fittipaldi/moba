# Use the official Node.js image
FROM node:23

# Set the working directory
WORKDIR /app

# Copy the rest of the application files
COPY . .
RUN npm install
RUN npm run build

# Expose the port that your app will run on
EXPOSE 40000

# Command to run the application
CMD ["node", "dist/index.js"]