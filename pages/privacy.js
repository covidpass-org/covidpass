import Page from '../components/Page'
import Card from '../components/Card'

export default function Privacy() {
  return(
    <Page content={
      <Card step="i" heading="Privacy Policy" content={
        <div className="space-y-2">
          <p>
            Our privacy policy is based on the terms used by the European legislator for the adoption of the General Data Protection Regulation (GDPR).
          </p>
          <p className="font-bold">General information</p>
          <div className="px-4">
            <ul className="list-disc">
              <li>
                The whole process of generating the pass file happens locally in your browser. For the signing step, ony a hashed representation of your data is sent to the server.
              </li>
              <li>
                Your data is not stored beyond the active browser session and the site does not use cookies.
              </li>
              <li>
                No data is sent to third parties.
              </li>
              <li>
                We transmit your data securely over https.
              </li>
              <li>
                Our server is hosted in Nuremberg, Germany.
              </li>
              <li>
                The source code of this site is available on <a href="https://github.com/marvinsxtr/covidpass" className="underline">GitHub</a>.
              </li>
              <li>
                By default, Apple Wallet passes are accessible from the lock screen. This can be changed in the <a href="https://support.apple.com/de-de/guide/iphone/iph9a2a69136/ios" className="underline">settings</a>.
              </li>
              <li>
                The server provider processes data to provide this site. In order to better understand what measures they take to protect your data, please also read their <a href="https://www.hetzner.com/de/rechtliches/datenschutz/" className="underline">privacy policy</a> and the <a href="https://docs.hetzner.com/general/general-terms-and-conditions/data-privacy-faq/" className="underline">data privacy FAQ</a>
              </li>
            </ul>
          </div>
          <p className="font-bold">Contact</p>
          <p>
            Marvin Sextro<br />
            Wilhelm-Busch-Str. 8A<br />
            30167 Hannover<br />
            Germany<br />
            Email: marvin.sextro@gmail.com<br />
            Website: <a href="https://marvinsextro.de" className="underline">https://marvinsextro.de</a><br />
          </p>
          <p className="font-bold">Simplified explanation of the process</p>
          <p>
            This process is only started after accepting this policy and clicking on the Add to Wallet button.
          </p>
          <p>
            First, the following steps happen locally in your browser:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>Recognizing and extracting the QR code data from your selected certificate</li>
              <li>Decoding your personal and health-related data from the QR code payload</li>
              <li>Assembling an incomplete pass file out of your data</li>
              <li>Generating a file containing hashes of the data stored in the pass file</li>
              <li>Sending only the file containing the hashes to our server</li>
            </ul>
          </div>
          <p>
            Second, the following steps happen on our server:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>Receiving and checking the hashes which were generated locally</li>
              <li>Signing the file containing the hashes</li>
              <li>Sending the signature back</li>
            </ul>
          </div>
          <p>
            Finally, the following steps happen locally in your browser:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>Assembling the signed pass file out of the inclomplete file generated locally and the signature</li>
              <li>Saving the file on your device</li>
            </ul>
          </div>
          <p className="font-bold">Locally processed data</p>
          <p>
            The following data is processed on in your browser to generate the pass file.
          </p>
          <p>
            Processed personal data contained in the QR code:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>Your first and last name</li>
              <li>Your date of birth</li>
            </ul>
          </div>
          <p>
            For each vaccination certificate contained in the QR code, the following data is processed:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>Targeted disease</li>
              <li>Vaccine medical product</li>
              <li>Manufacturer/Marketing Authorization Holder</li>
              <li>Dose number</li>
              <li>Total series of doses</li>
              <li>Date of vaccination</li>
              <li>Country of vaccination</li>
              <li>Certificate issuer</li>
              <li>Unique certificate identifier (UVCI)</li>
            </ul>
          </div>
          <p>
            For each test certificate contained in the QR code, the following data is processed:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>Targeted disease</li>
              <li>Test type</li>
              <li>NAA Test name</li>
              <li>RAT Test name and manufacturer</li>
              <li>Date/Time of Sample Collection</li>
              <li>Test Result</li>
              <li>Testing Centre</li>
              <li>Country of test</li>
              <li>Certificate Issuer</li>
              <li>Unique Certificate Identifier (UVCI)</li>
            </ul>
          </div>
          <p>
            For each recovery certificate contained in the QR code, the following data is processed:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>Targeted disease</li>
              <li>Date of first positive NAA test result</li>
              <li>Country of test</li>
              <li>Certificate Issuer</li>
              <li>Certificate valid from</li>
              <li>Certificate valid until</li>
              <li>Unique Certificate Identifier (UVCI)</li>
            </ul>
          </div>
          <p>
            The <a href="https://github.com/ehn-dcc-development/ehn-dcc-schema" className="underline">Digital Covid Certificate Schema</a> contains a detailed specification of which data can be contained in the QR code. 
          </p>
          <p className="font-bold">Server provider</p>
          <p>
            Our server provider is <a href="https://www.hetzner.com/" className="underline">Hetzner Online GmbH</a>.
            The following data may be collected and stored in the server log files:
          </p>
          <div className="px-4">
            <ul className="list-disc">
              <li>The browser types and versions used</li>
              <li>The operating system used by the accessing system</li>
              <li>The website from which an accessing system reaches our website (so-called referrers)</li>
              <li>The date and time of access</li>
              <li>The pseudonymised IP addresses</li>
            </ul>
          </div>
          <p className="font-bold">Your rights</p>
            In accordance with the GDPR you have the following rights:
          <div className="px-4">
            <ul className="list-disc">
              <li>
                Right of access to your data: You have the right to know what data has been collected about you and how it was processed.
              </li>
              <li>
                Right to be forgotten: Erasure of your personal data.
              </li>
              <li>
                Right of rectification: You have the right to correct inaccurate data.
              </li>
              <li>
                Right of data portability: You have the right to transfer your data from one processing system into another.
              </li>
            </ul>
          </div>
          <p className="font-bold">Third parties linked</p>
          <div className="px-4">
            <ul className="list-disc">
              <li>
                GitHub: <a href="https://docs.github.com/en/github/site-policy/github-privacy-statement" className="underline">Privacy Policy</a>
              </li>
              <li>
                PayPal: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full?locale.x=en_EN" className="underline">Privacy Policy</a>
              </li>
              <li>
                Gmail/Google: <a href="https://policies.google.com/privacy?hl=en-US" className="underline">Privacy Policy</a>
              </li>
              <li>
                Apple may sync your passes via iCloud: <a href="https://www.apple.com/legal/privacy/en-ww/" className="underline">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
      }/>
    }/>
  )
}