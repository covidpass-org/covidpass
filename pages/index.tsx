import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);
    const description = "Add your EU Digital COVID Certificates to your favorite wallet app.";

    return (
        <>
            <NextSeo
                title="Covidpass"
                description={description}
                openGraph={{
                    url: 'https://covidpass.marvinsextro.de/',
                    title: 'CovidPass',
                    description: description,
                    images: [
                        {
                            url: 'https://covidpass.marvinsextro.de/thumbnail.png',
                            width: 1000,
                            height: 500,
                            alt: description,
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
