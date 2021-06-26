# CovidPass

Web app for adding EU COVID-19 Vaccination Certificates to your wallets

The API can be found [here](https://github.com/marvinsxtr/covidpass-api).

## Setup

```sh
npm install
npm install -g nodemon
```

## Debug locally

```sh
nodemon -w server.js server.js
```

Build and run the container

```sh
docker build . -t covidpass
docker run -t -i -p 3000:3000 covidpass
```