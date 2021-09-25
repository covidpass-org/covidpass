import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';
import Alert from '../components/Alert';
import { useEffect, useState } from 'react';
import { isIOS, isSafari, isAndroid} from 'react-device-detect';


function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);

    const [warningMessages, _setWarningMessages] = useState<Array<string>>([]);

    const setWarningMessage = (message: string) => {
        if (!message) return;

        const translation = t('errors:'.concat(message));
        _setWarningMessages(Array.from(new Set([...warningMessages, translation !== message ? translation : message])));
    };

    const deleteWarningMessage = (message: string) => _setWarningMessages(warningMessages.filter(item => item !== message));

    // useEffect(() => {
    //     if (!isSafari) setWarningMessage("iPhone users, only Safari is supported at the moment. Please switch to Safari to prevent any unexpected errors.")
    // })
    

    // If you previously created a vaccination receipt before Sept. 23rd and need to add your date of birth on your vaccination receipt, please reimport your Ministry of Health official vaccination receipt again below and the date of birth will now be visible on the created receipt

    const title = 'Grassroots - Ontario vaccination receipt to your Apple wallet';
    const description = 'Stores it on iPhone with a QR code for others to validate in a privacy respecting way.';

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url: 'https://grassroots.vaccine-ontario.ca/',
                    title: title,
                    description: description,
                    // images: [
                    //     {
                    //         url: 'https://covidpass.marvinsextro.de/thumbnail.png',
                    //         width: 1000,
                    //         height: 500,
                    //         alt: description,
                    //     }
                    // ],
                    site_name: title,
                }}
                twitter={{
                    handle: '@grassroots_team',
                    site: '@grassroots_team',
                    cardType: 'summary_large_image',
                }}
            />
            <Page content={
                <div className="space-y-5">
                    {warningMessages.map((message, i) =>
                        <Alert message={message} key={'error-' + i} type="error" onClose={() => deleteWarningMessage(message)} />
                    )}
                    <Card content={
                        <div><p>{t('common:subtitle')}</p><br /><p>{t('common:subtitle2')}</p><br />
                            <b>Sept 24 updates</b> - Improvements: 
                            <br />
                            <br />
                            <ul className="list-decimal list-outside" style={{ marginLeft: '20px' }}>
                                <li>Added date of birth to the pass (to save more time for staff)</li>
                                <li>Corrected the color of Janssen receipts</li>
                                <li>Corrected 'Not Found' error for some users</li>
                                <li>Reduced # of errors (thanks for your patience, traffic grew 100x in 3 days, we are working hard to keep things smooth without line-ups.)</li>
                            </ul><br />
                            If you need to regenerate your pass, you can skip Step 1 altogether.  This will reduce the province's workload too. 🙏
                            <br />
                            <br />
                            <p>{t('common:continueSpirit')}</p></div>
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
