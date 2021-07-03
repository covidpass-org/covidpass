import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);

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
                        }
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
                        <p>{t('common:subtitle')}&nbsp;{t('index:iosHint')}</p>
                    }/>

                    <Form/>
                </div>
            }/>
        </>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'index', 'errors'])),
        },
    };
}

export default Index;
