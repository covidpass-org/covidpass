import {useTranslation} from 'next-i18next';

import Head from 'next/head'
import Logo from './Logo'
import Link from 'next/link'

interface PageProps {
    content: JSX.Element
}

function Page(props: PageProps): JSX.Element {
    const { t } = useTranslation('common');

    return (
        <div className="md:w-2/3 xl:w-2/5 md:mx-auto flex flex-col min-h-screen justify-center px-5 py-12">
            <Head>
                <title>{t('common:title')}</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div>
                <main className="flex flex-col space-y-5">
                    <Logo/>

                    {props.content}

                    <footer>
                        <nav className="nav flex pt-4 flex-row space-x-4 justify-center text-md font-bold flex-wrap">
                            {<Link href="/faq"><a className="underline">{t('common:faq')}</a></Link>}
                            <a href="https://www.youtube.com/watch?v=AIrG5Qbjptg" className="underline">{t('index:demo')}</a>
                            <a href="mailto:grassroots@vaccine-ontario.ca" className="underline">{t('common:contact')}</a>
                            <a href="https://vaccine-ontario.ca" className="underline">{t('common:returnToMainSite')}</a>

                            {/* <a href="https://github.com/billylo1/covidpass" className="hover:underline">{t('common:gitHub')}</a> */}
                        </nav>
                        <div className="flex pt-4 flex-row space-x-4 justify-center text-md flex-wrap">Last updated: 2021-09-04 (v1.3)</div>
                    </footer>
                </main>
            </div>
        </div>
    )
}

export default Page