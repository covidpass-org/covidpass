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
                <script src='patch-arrayBuffer.js' />
            </Head>
            <div>
                <main className="flex flex-col space-y-5">
                    <Logo/>

                    {props.content}

                    <footer>
                        <nav className="nav flex pt-4 flex-row space-x-4 justify-center text-md font-bold flex-wrap">
                            {<Link href="/faq"><a className="underline">{t('common:faq')}</a></Link>}
                            <a href="https://www.youtube.com/watch?v=AIrG5Qbjptg" className="underline">{t('index:demo')}</a>
                            <a href="https://twitter.com/grassroots_team" className="underline">{t('index:whatsnew')}</a>
                            <a href="mailto:grassroots@vaccine-ontario.ca" className="underline">{t('common:contact')}</a>
                            <a href="https://verifier.vaccine-ontario.ca" className="underline">{t('common:gotoVerifier')}</a>
                            <a href="https://github.com/billylo1/covidpass" className="underline">{t('common:gitHub')}</a>
                            <a href="https://vaccine-ontario.ca" className="underline">{t('common:returnToMainSite')}</a>
                        </nav>
                        <div className="flex pt-4 flex-row space-x-4 justify-center text-md flex-wrap">Last updated: 2021-09-18 (v1.8)</div>
                    </footer>
                </main>
            </div>
            <br/>
            <br/>
            <br/>
            <div id="pass-image" style={{backgroundColor: "orangered", color: "white", fontFamily: 'Arial', fontSize: 10, width: '350px', padding: '10px'}} hidden>
                <table style={{verticalAlign: "middle"}}>
                    <tbody>
                        <tr>
                            <td><img src='shield4.svg' width='50' height='50' /></td>
                            <td style={{fontSize: 20, width: 280}}><span><b>&nbsp;&nbsp;Vaccination Receipt</b></span></td>
                        </tr>
                    </tbody>
                 </table>
                <br/>
                <br/>
                <br/>

                <div style={{height:12}}><b>VACCINE</b></div>
                <div id='vaccineName' style={{fontSize:28}}></div>
                <br/>
                <br/>
                <table style={{fontSize:12, border: 0 }}>
                    <tbody>
                        <tr>
                            <td style={{width: 220}}><b>AUTHORIZED ORGANIZATION</b></td>
                            <td><b>DATE</b></td>
                        </tr>
                        <tr>
                            <td id='organization' style={{width: 220}}></td>
                            <td id='vaccinationDate' style={{width:120}}></td>
                        </tr>
                        <tr style={{height: 20}}></tr>
                        <tr>
                            <td><b>NAME</b></td>
                        </tr>
                        <tr>
                            <td id='name' style={{fontSize: 16}}></td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <br/>
                <br/>
                <br/>
                <div id='qrcode' style={{width:'63%', display:'block', marginLeft: 'auto', marginRight: 'auto'}}></div>
                <br/>
                <br/>
            </div>
            <canvas id="canvas" />
        </div>
    )
}

export default Page