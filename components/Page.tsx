import React from "react";
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
                        <div className="flex pt-4 flex-row space-x-4 justify-center text-md flex-wrap">Last updated: 2021-10-18 (v2.1.3)</div>
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
                            <td style={{fontSize: 20, width: 280}}><span style={{marginLeft: '11px'}}><b>Vaccination Receipt</b></span></td>
                        </tr>
                    </tbody>
                 </table>
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
                            <td><b>VACC. DATE</b></td>
                        </tr>
                        <tr>
                            <td id='organization' style={{width: 220}}></td>
                            <td id='vaccinationDate' style={{width:120}}></td>
                        </tr>
                        <tr id='extraRow2' hidden>
                            <td id='organization2' style={{width: 220}}></td>
                            <td id='vaccinationDate2' style={{width:120}}></td>
                        </tr>
                        <tr id='extraRow1' hidden>
                            <td id='organization1' style={{width: 220}}></td>
                            <td id='vaccinationDate1' style={{width:120}}></td>
                        </tr>
                        <tr style={{height: 20}}></tr>
                        <tr>
                            <td><b>NAME</b></td>
                            <td><b>DATE OF BIRTH</b></td>
                        </tr>
                        <tr>
                            <td id='name' style={{fontSize: 12}}></td>
                            <td id='dob' style={{fontSize: 12}}></td>
                        </tr>
                        <tr style={{height: 20}}></tr>
                        <tr>
                            <td><b></b></td>
                            <td><b>QR CODE EXPIRY</b></td>
                        </tr>
                        <tr>
                            <td id='null' style={{fontSize: 12}}></td>
                            <td id='expiry' style={{fontSize: 12}}>2021-10-22</td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <br/>
                <div id='qrcode' style={{width:'63%', display:'block', marginLeft: 'auto', marginRight: 'auto'}}></div>
                <br/>
                <br/>
            </div>
            <div id="shc-pass-image" style={{backgroundColor: "white", color: "black", fontFamily: 'Arial', fontSize: 10, width: '350px', padding: '10px'}} hidden>
                <table style={{verticalAlign: "middle"}}>
                    <tbody>
                        <tr>
                            <td><img src='shield-black.svg' width='50' height='50' /></td>
                            <td style={{fontSize: 20, width: 280}}>
                                <span style={{marginLeft: '11px', whiteSpace: 'nowrap'}}><b>COVID-19 Vaccination Card</b></span><br/>
                                <span style={{marginLeft: '11px'}}><b id='shc-card-origin'></b></span>
                            </td>
                        </tr>
                    </tbody>
                 </table>
                <br/>
                <br/>
                <div style={{fontSize:14, textAlign: 'center'}}>
                    <span id='shc-card-name' ></span>&nbsp;&nbsp;&nbsp;&nbsp;(<span id='shc-card-dob'></span>)
                </div>
                <br/>
                <br/>
                <table style={{textAlign: "center", width: "100%"}}>
                    <tbody>
                        <tr>
                            <td id='shc-card-vaccine-name-1'></td>&nbsp;&nbsp;<td id='shc-card-vaccine-name-2'></td>
                        </tr>
                        <tr>
                            <td id='shc-card-vaccine-date-1'></td>&nbsp;&nbsp;<td id='shc-card-vaccine-date-2'></td>
                        </tr>
                        <tr id='extraRow1' hidden>
                            <td id='shc-card-vaccine-name-3'></td>&nbsp;&nbsp;<td id='shc-card-vaccine-name-4'></td>
                        </tr>
                        <tr id='extraRow2' hidden>
                            <td id='shc-card-vaccine-date-3'></td>&nbsp;&nbsp;<td id='shc-card-vaccine-date-4'></td>
                        </tr>
                    </tbody>
                 </table>       
                <div id='shc-card-vaccine' style={{width:'63%', display:'block', marginLeft: 'auto', marginRight: 'auto'}}></div>

                <div id='shc-qrcode' style={{width:'63%', display:'block', marginLeft: 'auto', marginRight: 'auto'}}></div>
         
                <br/>
                <br/>
            </div>
            <canvas id="canvas" style={{display: 'none'}}/>
        </div>
    )
}

export default Page