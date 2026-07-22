FROM node:24-alpine

#create app dir and copy package files
WORKDIR /app 
COPY package*.json

RUN npm install

#copt app soource
COPY..

RUN echo "Creating a docker image by pawan poudyel"

CMD ["npm", "start"]