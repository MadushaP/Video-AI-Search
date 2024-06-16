# Use a lightweight Node.js base image
FROM node:18-alpine AS builder 

# Set the working directory
WORKDIR /app

# Copy the project directory
COPY . .

# Install dependencies (optional, if not using Cloud Build's npm install step)
RUN npm install

# # Build the Next.js application (production mode)
# RUN npm run build

# # Switch to a slimmer runtime image
# FROM node:16-alpine

# # Copy the production build from the builder stage
# COPY --from=builder /app/out /app

# # Expose the Next.js server port (typically 3000)
# EXPOSE 3000

# Set the command to start the Next.js server
CMD [ "npm", "run", "dev" ]

