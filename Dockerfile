# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

ENV VIPS_CONCURRENCY=1
# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "src/index.js"]
