FROM node:8.16-buster

# cp source code
COPY . /opt/store/ui

# install python dependencies
WORKDIR /opt/store/ui
RUN npm install

CMD npm start
