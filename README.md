![Grassroots](https://covidpass.marvinsextro.de/thumbnail.png)

This web app offers the ability to add your Ontario Vaccination Receipt as a pass into your Apple Wallet on iOS. Grassroots accomplishes this without sending your data to a server and instead only uses a hashed representation for the signing step.

# Getting started

If you want to add your vaccination certificate into your wallet with Grassroots, there are two main options.

* Use the [Grassroots web app](https://grassroots.vaccine-ontario.ca)

Here is a [demo](https://www.youtube.com/watch?v=AIrG5Qbjptg)

# Quick start

## Using our service

* Go to [https://grassroots.vaccine-ontario.ca](https://grassroots.vaccine-ontario.ca)
* Click Ontario Health to download your vaccination receipt onto your iPhone
* Select File, Browse, your-vaccine-receipt.pdf
* Add to the wallet

### Debug the web app

```sh
yarn install
yarn dev
```

### Run the Docker container

```sh
docker build . -t covidpass
docker run -t -i -p 3000:3000 covidpass
```

# FAQ

#### I do not want to trust a third party with my vaccination data, what makes this a secure option?

Processing of your data happens entirely in your browser and only a hashed representation is sent to the server for the signing step.

#### How do I make sure that nobody can access my vaccination pass from the lock screen (iOS)?

Navigate to the "TouchID & Code" or "FaceID & Code" or just "Code" section in the Settings and switch the toggle to off for Wallet in the section "Allow access from the lock screen". Also see [this official guide](https://support.apple.com/guide/iphone/control-access-information-lock-screen-iph9a2a69136/ios) from Apple.

# Using your own Apple Developer Certificate

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
* Base64 encode the contents of the newly generated .pem file inside the keys folder

## Run the API locally

A description of how you can use your certificate locally with the API will be provided in the readme of the [CovidPass API](https://github.com/covidpass-org/CovidPassApiNet). 
To connect the web app to your local server, you have to set the `API_BASE_URL` environment variable accordingly.

# Explanation of the process

The whole process of generating the pass file happens locally in your browser. For the signing step, only a hashed representation of your data is sent to the server.

First, the following steps happen locally in your browser:

* Validating the digital signature on the receipt to ensure it's authentic
* Decoding your vaccination event data from the PDF file
* Assembling a pkpass file out of your data
* Generating a file containing hashes of the data stored in the pass file
* Sending only the file containing the hashes to the server

Second, the following steps happen on the server:

* Receiving and checking the hashes which were generated locally
* Signing the file containing the hashes
* Sending the signature back

Finally, the following steps happen locally in your browser:

* Assembling the signed pass file out of the incomplete file generated locally and the signature
* Saving the file on your device

# Credits

The idea for this web app originated from the [solution of an Austrian web developer](https://coronapass.fabianpimminger.com), which only works for Austrian certificates at the moment.

The main codebase is forked from [covidpass](https://github.com/covidpass-org/covidpass)

# Contribute

Any contribution to this project is welcome. Feel free to leave your suggestions, issues or pull requests. 
