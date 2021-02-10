# QUEUE SUBSCRIBER

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

## Version

**v1.0.0**

## Dependencies

- nodejs: [https://nodejs.org/](https://nodejs.org/en/)
- rabbitmq: [https://www.rabbitmq.com/](https://www.rabbitmq.com/)
- docker: [https://www.docker.com/](https://www.docker.com/)

## NODE

### Installation

- Install typescript globally `npm install -g typescript`
- Install npm dependencies by running `npm install`
- Update the following configurations and database credentials on `{root}/src/config/*-config.json`
- Build typescript by running `npm run build:development`
- Get global config by running `npm run generate:config`

### How to Use

- run `npm start` it will listen to http://localhost:8082

## DOCKER

### Installation

- build `docker-compose build`
- install node `docker exec -ti node npm install`
- install node `docker exec -ti node npm run generate:config`

### How to Use

- run `docker-compose build`
- run `docker-compose up`
- run `docker-compose start`
