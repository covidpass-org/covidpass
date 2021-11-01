docker build . -t covidpass2 -t gcr.io/broadcast2patients/covidpass2
docker push gcr.io/broadcast2patients/covidpass2
gcloud config set project broadcast2patients
gcloud config set run/region us-east1
gcloud run deploy covidpass2 --image gcr.io/broadcast2patients/covidpass2:latest --platform managed
 