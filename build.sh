docker build . -t covidpass -t gcr.io/broadcast2patients/covidpass
docker push gcr.io/broadcast2patients/covidpass
docker image prune -f
