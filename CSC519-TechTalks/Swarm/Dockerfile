FROM mhart/alpine-node:6

COPY app.js /
COPY package.json /
# RUN apk update
# RUN apk add --no-cahce git

RUN cd / && npm install
CMD cd / && node app.js