import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import React, {useEffect, useState} from "react";
import QRCode from "react-qr-code";

import Alert from '../components/Alert';
import Card from '../components/Card';
import Logo from "../components/Logo";

function Pass(): JSX.Element {
    const { t } = useTranslation(['common', 'index']);

    const [fragment, setFragment] = useState<string>(undefined);
    const [view, setView] = useState<boolean>(true);

    useEffect(() => {
        const rawFragment = window.location.hash.substring(1);

        if (!rawFragment) {
            setView(false);
        }
        
        const resizeTimeout = window.setTimeout(() => {
            if (rawFragment) {
                window.location.replace('/pass/note');
            }
        }, 100);

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            const decodedFragment = Buffer.from(rawFragment, 'base64').toString();
            setFragment(decodedFragment);
        });
    }, []);

    return (
        <div className="py-5 flex flex-col space-y-5 md:w-2/3 xl:w-2/5 md:mx-auto items-center justify-center px-5">
            <Logo/>
            <div className="flex flex-row items-center">
                {
                    fragment && 
                    <Card content={
                        <div className="p-2 bg-white rounded-md">
                            <QRCode value={fragment} size={280} level="L" />
                        </div>
                    } />
                }
                {
                    !view && 
                    <Alert isWarning={true} message={t('index:viewerNote')} onClose={undefined} />
                }
            </div>
        </div>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['index', 'common'])),
        },
    };
}

export default Pass;
