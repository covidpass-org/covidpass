import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';
import Alert from '../components/Alert';
import React, { useEffect, useState } from 'react';
import { isIOS, isSafari } from 'react-device-detect';
import usePassCount from "../src/hooks/use_pass_count";
import Link from 'next/link'

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);
    const passCount = usePassCount();    
    const displayPassCount = (passCount? `${passCount} receipts have been processed successfully to date!` : '');

    const [warningMessages, _setWarningMessages] = useState<Array<string>>([]);

    const setWarningMessage = (message: string) => {
        if (!message) return;

        const translation = t('errors:'.concat(message));
        _setWarningMessages(Array.from(new Set([...warningMessages, translation !== message ? translation : message])));
    };

    const deleteWarningMessage = (message: string) => _setWarningMessages(warningMessages.filter(item => item !== message));

    useEffect(() => {
        if (isIOS && !isSafari) setWarningMessage("iPhone users, only Safari is supported at the moment. Please switch to Safari to prevent any unexpected errors.")
        else if (!isIOS) {
                setWarningMessage('Only Safari on iOS is officially supported for Apple Wallet import at the moment - ' +
                    'for other platforms, please create a photo card or ensure you have an application which can open Apple Wallet .pkpass files');
        }
    }, []);
    

    const title = 'Grassroots - vaccination QR Code import for Apple and Android devices. Supports BC AB SK MB ON QC NS YK NT NY NJ CA LA VA HI UT';
    const description = 'Grassroots imports vaccination QR codes and stores them on Apple and Android devices in a convenient, secure, and privacy-respecting way. Supports SHC QR codes from BC AB SK MB ON QC NS YK NT NY NJ CA LA VA HI UT';

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url: 'https://grassroots.vaccine-ontario.ca/',
                    title: title,
                    description: description,
                    images: [
                        {
                            url: 'https://grassroots.vaccine-ontario.ca/grassroots.jpg',
                            width: 400,
                            height: 400,
                            alt: description,
                        }
                    ],
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
                        <Alert message={message} key={'error-' + i} type="warning" onClose={() => deleteWarningMessage(message)} />
                    )}
                    <Card content={
                        <div><p>{t('common:subtitle')}</p><br /><p>{t('common:subtitle2')}</p><br />
                            <b>{displayPassCount}</b><br/><br/>
                            <b>MAJOR NEW RELEASE! </b>Oct 15 evening update: 
                            <br />
                            <br />
                            <ul className="list-decimal list-outside" style={{ marginLeft: '20px' }}>
                                <li>You can now import the new enhanced receipt from Ontario onto your Apple or Android devices</li>
                                <li>Support released for importing Ontario, British Columbia, Alberta, Saskatchewan, Nova Scotia, Québec, Yukon, California, New York, and Louisiana SHC QR codes</li>
                                <li>Support released for importing QR codes from images as well as from PDFs</li>
                                <li>Support for creating our previous interim QR codes has been removed - now that the official Ontario QR code is being released and the gap is filled, our QR codes are no longer needed</li>
                                <li>Support released for importing Manitoba's (new unannounced) QR codes, as well as for Northwest Territories, New Jersey, Hawaii, Virginia, and Utah SHC QR codes</li>
                            </ul><br />
                            <p>{t('common:continueSpirit')}</p>
                            <br />
                            <Link href="https://www.youtube.com/watch?v=AIrG5Qbjptg">
                                <a className="underline" target="_blank">
                                    Click here for a video demo
                                </a>
                            </Link>&nbsp;
                            </div>
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
