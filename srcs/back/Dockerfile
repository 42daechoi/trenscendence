FROM node:alpine

RUN mkdir /back
RUN mkdir /my-app
WORKDIR /back
RUN apk add sudo
WORKDIR /back/my-app
COPY init.sh /back
CMD [ "sh", "../init.sh" ]