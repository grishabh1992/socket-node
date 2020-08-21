# Specify bas image
FROM node:alpine

WORKDIR /usr/app

# Install Dependency
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# Run command
CMD ["npm", "run", "prod"]