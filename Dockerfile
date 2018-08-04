FROM node:8

# Docker image contains necessary node_modules needed for the project
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY . /usr/src/app