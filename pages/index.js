import { NextSeo } from 'next-seo';

import Form from '../components/Form'
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
              width: 1000,
              height: 500,
              alt: 'CovidPass: Add your EU Digital Covid Vaccination Certificates to your favorite wallet app.',
            },
            {
              url: 'https://covidpass.marvinsextro.de/favicon.png',
              width: 500,
              height: 500,
              alt: 'CovidPass',
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
        <div className="space-y-5">
          <Card content={
            <p>
              Add your EU Digital Covid Vaccination Certificates to your favorite wallet app. On iOS, please use the Safari Browser.
            </p>
          } />

          <Form className="flex-grow" />
        </div>
      } />
    </>
  )
}
