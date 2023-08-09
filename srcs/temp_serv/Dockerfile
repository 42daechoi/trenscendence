FROM node:alpine

RUN mkdir /server
WORKDIR /server
RUN apk add sudo
# COPY init.sh /server

# COPY ../../my-app /front
# CMD [ "sleep", "1000000" ]
# CMD [ "sleep", "1000000" ]
CMD [ "sh", "./init.sh" ]