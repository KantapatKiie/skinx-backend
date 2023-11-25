FROM  node:16-alpine3.16

# set working directory

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies

COPY . .

RUN npm install

RUN npx tsc

# start app

CMD ["npm","run","start"]
EXPOSE 3001