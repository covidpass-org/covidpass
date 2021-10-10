# Grassroots

This web-based tool allows you to add your Ontario Vaccination Receipt as a pass into your Apple Wallet on iOS in a privacy-respecting way. It achieves this without sending your data to a server and instead uses a hashed representation for the signing step.

Here is a [demo](https://www.youtube.com/watch?v=AIrG5Qbjptg)

# Quick start

* Go to [https://grassroots.vaccine-ontario.ca](https://grassroots.vaccine-ontario.ca)
* Click Ontario Health to download your vaccination receipt onto your iPhone (local storage)
* Select File, Browse, your-vaccine-receipt.pdf
* Add to the wallet

### Debug the web app

```sh
yarn install
yarn dev
```

### Run the Docker container

```sh
docker build . -t covidpass -t gcr.io/broadcast2patients/covidpass
docker run --rm -t -i -p 3000:3000 covidpass
```

### Integration with other repos required

[setup.md](setup.md) has the details on how to bring the components together.

# FAQ

#### I do not want to trust a third party with my vaccination data, does this tool respect my privacy?

Processing of your data happens entirely in your browser and only a hashed representation is sent to the server for the signing step. For more details of this, please see https://toronto.ctvnews.ca/video?clipId=2294461

#### How do I make sure that nobody can access my vaccination pass from the lock screen (iOS)?

Navigate to the "TouchID & Code" or "FaceID & Code" or just "Code" section in the Settings and switch the toggle to off for Wallet in the section "Allow access from the lock screen". Also see [this official guide](https://support.apple.com/guide/iphone/control-access-information-lock-screen-iph9a2a69136/ios) from Apple.

# Using your own Apple Developer Certificate (if you would like to fork this project and run it yourself)

## Get your certificate

* Sign into your [Apple Developer Account](https://developer.apple.com/account/)
* Go to Certificates, Identifiers and Profiles
* Register a new Pass Type Identifier under the Identifiers tab
* Create a new Pass Type ID Certificate under the Certificates tab
* Select your previously created Pass Type Identifier in the process
* Move your new certificate to the My Certificates tab in the keychain
* Export your certificate as a .p12 file


* Install node.js and download the [passkit-keys](https://github.com/walletpass/pass-js/blob/master/bin/passkit-keys) script
* Create a `keys` folder and put the .p12 file inside
* Run ./passkit-keys `<path to your keys folder>`
* You may have to type in the passphrase you defined during the export step

## Run the API locally

A description of how you can use your certificate locally with the API will be provided in the readme of the [CovidPass API](https://github.com/covidpass-org/CovidPassApiNet). 
To connect the web app to your local server, you have to set the `API_BASE_URL` environment variable accordingly.

# Explanation of the process

The whole process of generating the pass file happens locally in your browser. For the signing step, a hashed representation of your data is sent to the server.

First, the following steps happen locally in your browser:

* Validating the digital signature on the receipt from Ontario Health to ensure it's authentic
* Decoding your vaccination event data from the PDF file (e.g. date, type of vaccine, dose #, organization who administered it
* Assembling a pkpass file out of your data
* Sending the serial number and vaccination event data for verification when the QR code is scanned.
* Generating a file containing hashes of the data stored in the pass file
* Sending only the file containing the hashes to the server

Second, the following steps happen on the server:

* Receiving and checking the hashes which were generated locally
* Signing the file containing the hashes
* Sending the signature back

Finally, the following steps happen locally in your browser:

* Assembling the signed pass file out of the incomplete file generated locally and the signature
* Saving the file on your device

# Logging

* Sentry.io is used. Please put your DSN into your environment variable SENTRY_DSN at runtime to activate it.

# Credits

The idea for this web app originated from the [solution of an Austrian web developer](https://coronapass.fabianpimminger.com), which only works for Austrian certificates at the moment.

The main codebase is forked from [covidpass](https://github.com/covidpass-org/covidpass) and added Ontario specifcs.

# Contribute

Contributions to this project is welcome. Feel free to leave your suggestions, issues or pull requests. 
