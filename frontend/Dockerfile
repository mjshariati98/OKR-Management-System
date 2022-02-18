FROM node:16.12-slim 

WORKDIR /home/front

COPY package.json .
COPY package-lock.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

WORKDIR /home/front/build
CMD [ "../node_modules/.bin/serve", "-s", "." ]