# 1. Start with a clean kitchen.
# Get a lightweight version of the Alpine Linux operating system that already has Node.js v18 pre-installed.
FROM node:18-alpine

# 2. Prepare the workspace.
# Create a folder named '/app' inside the computer to hold our project.
WORKDIR /app

# 3. Add the ingredients list.
# Copy just the package.json and package-lock.json files. This is a smart optimization.
COPY package*.json ./

# 4. Install the tools.
# Run 'npm install' to download all the dependencies from the package files.
RUN npm install

# 5. Add the rest of the ingredients.
# Now, copy all the other project files (your source code).
COPY . .

# 6. Prepare the frontend.
# Run the 'npm run build' command to create the optimized React build folder.
RUN npm run build

# 7. Label the oven.
# Announce that the application inside will be running on port 5000.
EXPOSE 5000

# 8. The final instruction.
# When the container starts, run the command 'node server/index.js'.
CMD [ "node", "server/index.js" ]