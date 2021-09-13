import 'tailwindcss/tailwind.css';

import {DefaultSeo} from 'next-seo';
import SEO from '../next-seo.config';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';

import { initSentry } from '../src/sentry';

initSentry();

function MyApp({Component, pageProps}: AppProps): JSX.Element {
    return (
        <>
            <DefaultSeo {...SEO} />
            <Component {...pageProps} />
        </>
    )
}

export default appWithTranslation(MyApp);