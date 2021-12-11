# set base image (host OS)
FROM node:16-alpine

# set the working directory in the container
WORKDIR /code

# Update the container
RUN apk update && apk add curl bash python3 build-base

COPY package*.json ./

# install dependencies and get ride of cache
RUN npm install && npm cache clean --force

# copy the dependencies file to the working directory
COPY . .

RUN npm run build

RUN npm run prisma:deploy
RUN npx prisma generate
RUN npm rebuild bcrypt --build-from-source

# get rid of development modules used for compiling the typescript build files
RUN npm prune --production

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN /usr/local/bin/node-prune

ENV docker true
ENV NODE_ENV production

# command to run on container start
CMD [ "npm", "run", "start"]
