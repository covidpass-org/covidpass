docker build . -t covidpass -t gcr.io/broadcast2patients/covidpass
docker push gcr.io/broadcast2patients/covidpass
gcloud config set project broadcast2patients
gcloud config set run/region us-east1
gcloud run deploy covidpass --image gcr.io/broadcast2patients/covidpass:latest --platform managed
