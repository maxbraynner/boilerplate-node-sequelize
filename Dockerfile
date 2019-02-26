FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

RUN NO_YARN_POSTINSTALL=1 yarn --silent

# Bundle app source
COPY . .

ARG PORT=4000
ARG NODE_ENV=production

ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

# build and prune devdependencies
RUN yarn run build && yarn run prune && yarn cache clean --force

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

# default to port 4000 for node, and 9229 for debug
EXPOSE $PORT 9229

CMD yarn start