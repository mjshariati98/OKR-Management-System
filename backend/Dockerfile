FROM node:16.12-slim 

WORKDIR /home/backend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .