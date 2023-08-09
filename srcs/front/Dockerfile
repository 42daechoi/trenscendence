FROM node:alpine

RUN mkdir /front
RUN mkdir /my-app
WORKDIR /front
RUN apk add sudo
WORKDIR /front/my-app
COPY init.sh /front
# COPY ../../my-app /front
# CMD [ "sleep", "1000000" ]
CMD [ "sh", "../init.sh" ]
