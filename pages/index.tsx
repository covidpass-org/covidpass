import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';
import Alert from '../components/Alert';
import React, { useEffect, useState } from 'react';
import { isIOS, isSafari, isAndroid, osVersion, isMacOs} from 'react-device-detect';
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
        if ((isIOS && !isMacOs) && !isSafari) {
            setWarningMessage("iPhone users, only Safari is supported at the moment. Please switch to Safari to prevent any unexpected errors.");
        } else {
            if (isAndroid) {
                if (Number(osVersion.split('.')[0]) >= 8) {
                    setWarningMessage("Hi Android user! Check out our new Add to Google Pay button!");
                } else {
                    setWarningMessage("Sorry, Add to Google Pay is only available to Android 8.1+");
                }
            } 
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
                            <b>MAJOR NEW RELEASE!</b> Oct 20th update: 
                            <br />
                            <br />
                            <ul className="list-decimal list-outside" style={{ marginLeft: '20px' }}>
                                <li>(Often-requested) support added for importing proof-of-vaccination into Google Pay on Android 8.1+</li>
                                <li>You can now scan QR codes directly off of paper or a screen with your camera, eliminating the need to upload PDFs or pictures</li>
                                <li>Support added for importing QR codes from images as well as from PDFs</li>
                            </ul><br />
                            <p>{t('common:continueSpirit')}</p>
                            <br />
                            <Link href="https://www.youtube.com/watch?v=AIrG5Qbjptg">
                                {/* <a className="underline" target="_blank"> */}
                                <a className="underline">
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
