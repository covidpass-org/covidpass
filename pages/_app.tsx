import 'tailwindcss/tailwind.css'

import {DefaultSeo} from 'next-seo';
import SEO from '../next-seo.config';
import type {AppProps} from 'next/app'

function MyApp({Component, pageProps}: AppProps): JSX.Element {
    return (
        <>
            <DefaultSeo {...SEO} />
            <Component {...pageProps} />
        </>
    )
}

export default MyApp;