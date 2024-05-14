FROM node:18
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN \
npm i --production && \
chown 1000:1000 -Rf /app 
 
VOLUME /cache

USER 1000
ENTRYPOINT ["npm","run"]