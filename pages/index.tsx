import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);

    const title = 'Koronapassi';
    const description = 'Lisää KELA:n digitaaliset COVID-sertifikaatit suosikkilompakkosovellukseesi.';

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url: 'https://covidpassi.fi',
                    title: title,
                    description: description,
                    images: [
                        {
                            url: 'https://covidpassi.fi/thumbnail.png',
                            width: 1000,
                            height: 500,
                            alt: description,
                        }
                    ],
                    site_name: title,
                }}
                twitter={{
                    handle: '@jantsop',
                    site: '@marvinsxtr',
                    cardType: 'summary_large_image',
                }}
            />
            <Page content={
                <div className="space-y-5">
                    <Card content={
                        <p>{t('common:subtitle')}</p>
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
