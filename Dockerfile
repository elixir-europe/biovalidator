FROM node:18-buster

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./start.sh /
COPY . .
RUN npm run test

ENTRYPOINT ["/start.sh"]
