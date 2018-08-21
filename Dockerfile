FROM node:8-alpine

ARG NO_RUN_MIGRATION

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

RUN NO_YARN_POSTINSTALL=1 yarn --silent

# Bundle app source
COPY . .

ENV NODE_ENV=production

# development: just run build
# prudction: build, migrations and prune devdependencies
RUN if test -n "$NO_RUN_MIGRATION"; then yarn build; else yarn migrate && yarn run prune && yarn cache clean --force; fi

# default to port 4000 for node, and 9229 for debug
ARG PORT=4000
ENV PORT $PORT
EXPOSE $PORT 9229

CMD yarn start