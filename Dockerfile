# Specify base image
FROM node:alpine

WORKDIR /usr/app

# Install Dependency
COPY ./package.json ./

RUN npm install

COPY ./ .

#Expose port and start application
EXPOSE 8080

# Run command
CMD ["npm", "run", "prod"]