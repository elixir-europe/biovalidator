FROM node:18-buster

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY ./start.sh /

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

ENTRYPOINT ["/start.sh --port 8080"]
