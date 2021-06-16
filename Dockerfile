# Specify base image
FROM node:14

WORKDIR /usr/app

# Install Dependency
COPY ./package.json ./

RUN npm install

COPY ./ .

#Expose port and start application
EXPOSE 8001

# Run command
CMD ["npm", "run", "prod"]