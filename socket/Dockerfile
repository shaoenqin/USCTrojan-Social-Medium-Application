FROM node:16-bullseye


WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8900

CMD [ "index.js" ]