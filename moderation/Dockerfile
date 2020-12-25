# install base image
FROM node:alpine

# Setup working directory
WORKDIR /usr/app

# Setup node.js and dependencies
COPY ./package.json ./
RUN npm install

# Copy the rest of the project files
COPY ./ ./

# Start service with npm start
CMD ["npm", "start"]