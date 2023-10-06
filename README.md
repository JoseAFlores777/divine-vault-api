
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<br>

# DivineVault API

The DivineVault API is the heart of an application that enables you to carry your favorite Bible verses with you wherever you go. Picture having instant access to your most inspiring and meaningful passages at any time and place. With the DivineVault API, you can capture and save those verses that touch your heart and soul, creating your own digital sanctuary of the Bible.

<br>

## Tech Stack

**Server:** NestJS

**Database:** MongoDb

**Others:** Docker, Github Actions, AWS Lambda, AWS API Gateway

<br><br>

## Get started

Clone the project

```bash
  git clone https://github.com/JoseAFlores777/divine-vault-api.git
```

Go to the project directory

```bash
cd divine-vault-api
```

Install dependencies

```bash
yarn install
```

Install NestJs CLI

```bash
  sudo npm i -g @nestjs/cli
```

<br><br>


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI = 'mongodb://localhost:27017/divine-vault'` 
##### This is the correct mongo URI that will be used by mongo container

<br><br>

## Run development environment

To run this project in development environment:

Set up database container:

```bash
docker compose up -d
```

Run the app:

```bash
yarn start:dev
```

Go to http://localhost:3000 to test the api

<br><br>

## Run production environment

To run this project in production environment we'll use docker:


Run the app:

```bash
docker compose -f docker-compose.prod.yml up
```

Go to http://localhost:3000 to test the api

<br><br>

## Deploy locally with Serverless Framework offline

To simulate a deploy in aws with AWS Lambda and AWS API Gateway locally:

Install Serverless Framework:

```bash
sudo npm install -g serverless
```

Deploy the app:

```bash
yarn sls-offline
```

Go to http://localhost:3000/prod to test the api

<br><br>

## Test

```bash
yarn run test

yarn run test:e2e

yarn run test:cov
```

<br><br>

## Stay in touch

- Author - [José Izaguirre](https://github.com/JoseAFlores777)
- Website - [https://www.joseiz.com/](https://www.joseiz.com/)

## License

Nest is [MIT licensed](LICENSE).
