Environment Overview

The whole solution is made up of 4 repos.

1. covidpass (Wallet Pass creation front-end, port 3000)
2. covidpassApiDotNet (Wallet Pass signing service, Apple specific, port 80)
3. verifier (web app for scanning, port 5001;  GCP cloud functions /register /verify in support of #1)
4. hit-counter (simple python script running in VM, web enabled using flask, port 8080)

The steps were tested against a standard debian vm running in GCP

Firewall Rule config
- allow-covidpass-ports, port 3000,80,5001,5003,8080 tcp/inbound

VM setup
- ubuntu, no customization, 2 core, 4Gb RAM, allow all GCP API, network tag (allow-covidpass-ports), fixed external ip will be useful

ssh into that vm

Install docker
   https://docs.docker.com/engine/install/ubuntu/

Enable non-root usage of docker   
   sudo groupadd docker
   sudo usermod -aG docker ${USER}
   exit SSH session and login again

Install yarn
   curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
   echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
   sudo apt-get update && sudo apt-get install yarn 

Upgrade node to 14
   sudo apt-get install -y nodejs

mkdir web
cd web

Repo 1 (covidpass)

    git clone https://github.com/billylo1/covidpass.git
    cd covidpass
    yarn install

    note external IP of your dev machines
    modify .env.local and replace localhost with your {vm-external-ip} 

    yarn dev

    access it from your workstation's browser (http://vm-external-ip:3000)
    you should see on the yarn output compiling... sentry initialized and browser showing page

Repo 2 (https://github.com/billylo1/CovidPassApiNet)

    cd ~/web
    git clone https://github.com/billylo1/CovidPassApiNet
    cd CovidPassApiNet/CovidPassApiNet
    cp appsettings.example.json appsettings.json

    setup Apple Developer Certificate (assume current directory is the above)

        1. Sign into your Apple Developer Account
        2. Go to Certificates, Identifiers and Profiles
        3. Register a new Pass Type Identifier under the Identifiers tab
        4. Create a new Pass Type ID Certificate under the Certificates tab
        5. Select your previously created Pass Type Identifier in the process
        6. Move your new certificate to the My Certificates tab in the keychain
        7. Export your certificate as a .p12 file (make a note of passphrase)
        8. Create a text file named AppleDeveloperPassword with your passphrase in it
        9. Install node.js and download the passkit-keys script
        10. Create a keys folder and put the .p12 file inside
        11. Run ./passkit-keys <path to your keys folder>
        12. copy the .pem file to ~/web/CovidPassApiNet/CovidPassApiNet/AppDeveloperCerticate.pem
        13. Open keychain - System Keychain - Certificates
        14. Export Apple Developer Relations Certification Authority to AppleCaCertificate.pem
        15. chmod 600 Apple*.pem 

        (Reminder: pls protect these files as they contain private key and passphrases. Do not add them to your repo.)
    
    docker build . -t covidpassapinet
    docker run covidpassapinet -p 80:80

Repo 3 (https://github.com/billylo1/verifier)    

    cd ~/web
    git clone https://github.com/billylo1/verifier

    sudo npm install -g firebase-tools
    firebase init
    sudo apt install default-jre
    firebase emulators:start

Repo 4 (https://github.com/billylo1/hit-counter)

    cd ~/web
    git clone https://github.com/billylo1/hit-counter
    sudo apt-get install python3.8 python3-pip
    python3 server.py





