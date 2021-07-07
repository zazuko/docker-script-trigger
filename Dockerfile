FROM node:14-alpine

ENV SERVER_PORT="3000"
ENV SERVER_HOST="::"
ENV SCRIPTS_PATH="/scripts"

EXPOSE 3000

RUN apk add --no-cache tini

WORKDIR /docker-script-trigger

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# build the server
COPY . .

# copy default scripts
COPY ./scripts /scripts
WORKDIR /scripts

CMD [ "tini", "--", "node", "/docker-script-trigger/src/index.js" ]
