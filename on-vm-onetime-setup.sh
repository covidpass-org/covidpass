#!/bin/bash -e

export SCRAPER_SRCDIR="/home/vagrant/covidpass"
export SCRAPER_TMPDIR="/home/vagrant/covidtemp"

mkdir ${SCRAPER_TMPDIR}
cd ${SCRAPER_TMPDIR}

${SCRAPER_SRCDIR}/sync.sh || /bin/true

npm install

echo "Log into GCloud now, and choose broadcast2patients as the project; do not choose a region"
sudo google init --console-only
sudo gcloud config set run/region us-east1