import { NextSeo } from 'next-seo';

import Form from '../components/Form'
import Logo from '../components/Logo'
import Card from '../components/Card'
import Page from '../components/Page'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Covidpass"
        description="Add your EU Digital Covid Vaccination Certificates to your favorite wallet app."
        openGraph={{
          url: 'https://covidpass.marvinsextro.de/',
          title: 'CovidPass',
          description: 'Add your EU Digital Covid Vaccination Certificates to your favorite wallet app.',
          images: [
            {
              url: 'https://covidpass.marvinsextro.de/thumbnail.png',
              width: 396,
              height: 217,
              alt: 'CovidPass: Add your EU Digital Covid Vaccination Certificates to your favorite wallet app.',
            },
          ],
          site_name: 'CovidPass',
        }}
        twitter={{
          handle: '@marvinsxtr',
          site: '@marvinsxtr',
          cardType: 'summary_large_image',
        }}
      />
      <Page content={
        <div>
          <main className="flex flex-col">
            <Logo />

            <Card content={
              <p>
                Add your EU Digital Covid Vaccination Certificates to your favorite wallet app. On iOS, please use the Safari Browser.
              </p>
            } />

            <Form className="flex-grow" />
            
            <footer>
              <nav className="nav flex space-x-4 m-6 flex-row-reverse space-x-reverse text-md font-bold">
                <a href="/privacy" className="hover:underline" >Privacy Policy</a>
                <a href="/imprint" className="hover:underline" >Imprint</a>
                <a href="https://www.paypal.com/paypalme/msextro" className="hover:underline" >Donate</a>
                <a href="https://github.com/marvinsxtr/covidpass" className="hover:underline" >GitHub</a>
              </nav>
            </footer>
          </main>
        </div>
      } />
    </>
  )
}
