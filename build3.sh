docker build . -t covidpass3 -t gcr.io/broadcast2patients/covidpass3
docker push gcr.io/broadcast2patients/covidpass3
gcloud config set project broadcast2patients
gcloud config set run/region us-east1
gcloud run deploy covidpass3 --image gcr.io/broadcast2patients/covidpass3:latest --platform managed
