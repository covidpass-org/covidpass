# CovidPass

Webtool for generating a wallet pass from an official EU COVID-19 Vaccination Certificate QR code

## Debug locally

```sh
docker build . -t covidpass
docker run --env-file .env -t -i -p 3000:3000 covidpass
```