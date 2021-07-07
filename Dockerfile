FROM node:14

ENV SERVER_PORT="3000"
ENV SERVER_HOST="::"
ENV SCRIPTS_PATH="/scripts"

EXPOSE 3000

WORKDIR /docker-script-trigger

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# build the server
COPY . .
RUN npm run build

# copy default scripts
COPY ./scripts /scripts
WORKDIR /scripts

CMD [ "node", "/docker-script-trigger/dist/index.js" ]
