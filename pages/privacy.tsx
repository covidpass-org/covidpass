import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Privacy(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'privacy']);
    return (
        <Page content={
            <Card step="i" heading={t('common:privacyPolicy')} content={
                <div className="space-y-3">
                    <p>{t('privacy:gdprNotice')}</p>
                    <p className="font-bold text-lg">{t('privacy:generalInfo')}</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:generalInfoProcess')}</li>
                            <li>{t('privacy:generalInfoStoring')}</li>
                            <li>{t('privacy:generalInfoThirdParties')}</li>
                            <li>{t('privacy:generalInfoHttps')}</li>
                            <li>{t('privacy:generalInfoLocation')}</li>
                            <li>
                                {t('privacy:generalInfoGitHub')}
                                &nbsp;
                                <a href="https://github.com/jantsop/covidpass" className="underline">
                                    GitHub
                                </a>.
                            </li>
                            <li>
                                {t('privacy:generalInfoLockScreen')}
                                &nbsp;
                                <a href="https://support.apple.com/guide/iphone/control-access-information-lock-screen-iph9a2a69136/ios" className="underline">
                                    {t('privacy:settings')}
                                    </a>.
                            </li>
                            <li>
                                {t('privacy:generalInfoProvider')}
                                <a href="https://www.hetzner.com/rechtliches/datenschutz/" className="underline">
                                    {t('privacy:privacyPolicy')}
                                </a>
                                &nbsp;
                                {t('privacy:andThe')} 
                                &nbsp;
                                <a href="https://docs.hetzner.com/general/general-terms-and-conditions/data-privacy-faq" className="underline">
                                    {t('privacy:dataPrivacyFaq')}
                                </a>.
                            </li>
                        </ul>
                    </div>
                    <p className="font-bold">{t('privacy:contact')}</p>
                    <p>
<<<<<<< HEAD
                        Jantso Porali<br/>
                        Rakentajanpolku 3H<br/>
                        96960 Rovaniemi<br/>
                        {t('privacy:email')}:
                        &nbsp;
                        <a href="mailto:jantso.porali@gmail.com">jantso.porali@gmail.com</a>
=======
                        Marvin Sextro
                        <br/>
                        {t('privacy:email')}:
                        &nbsp;
                        <a href="mailto:covidpass@marvinsextro.de" className="underline">covidpass@marvinsextro.de</a>
>>>>>>> 68387b1eaef1fe256d04b3c888afb61967115ccf
                        <br/>
                    </p>
                    <p className="font-bold">{t('privacy:process')}</p>
                    <p>{t('privacy:processFirst')}:</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:processRecognizing')}</li>
                            <li>{t('privacy:processDecoding')}</li>
                            <li>{t('privacy:processAssembling')}</li>
                            <li>{t('privacy:processGenerating')}</li>
                            <li>{t('privacy:processSending')}</li>
                        </ul>
                    </div>
                    <p>{t('privacy:processSecond')}:</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:processReceiving')}</li>
                            <li>{t('privacy:processSigning')}</li>
                            <li>{t('privacy:processSendingBack')}</li>
                        </ul>
                    </div>
                    <p>{t('privacy:processThird')}:</p>
                    <div className="px-5">
                        <ul className="list-disc">
                            <li>{t('privacy:processCompleting')}</li>
                            <li>{t('privacy:processSaving')}</li>
                        </ul>
                    </div>
                    <p className="font-bold">{t('privacy:locallyProcessedData')}</p>
                    <p>
                        <a href="https://github.com/ehn-dcc-development/ehn-dcc-schema" className="underline">
                            {t('privacy:schema')}
                        </a>
                        &nbsp;
                        {t('privacy:specification')}
                    </p>
                    <p className="font-bold">{t('privacy:serverProvider')}</p>
                    <p>{t('privacy:serverProviderIs')}</p>
                    <p>
                        <a href="https://www.hetzner.com/" className="underline">
                            Hetzner Finland Oy
                        </a>
                        <br />
                        Huurrekuja 10<br />
                        04360 Tuusula<br />
                    </p>
                    <p>{t('privacy:logFiles')}:</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:logFilesBrowser')}</li>
                            <li>{t('privacy:logFilesOs')}</li>
                            <li>{t('privacy:logFilesReferrer')}</li>
                            <li>{t('privacy:logFilesTime')}</li>
                            <li>{t('privacy:logFilesIpAddress')}</li>
                        </ul>
                    </div>
                    <p className="font-bold">{t('privacy:rights')}</p>
                    <p>{t('privacy:rightsGranted')}:</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:rightsAccess')}</li>
                            <li>{t('privacy:rightsErasure')}</li>
                            <li>{t('privacy:rightsRectification')}</li>
                            <li>{t('privacy:rightsPortability')}</li>
                        </ul>
                    </div>
                    <p className="font-bold">{t('privacy:thirdParties')}</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>
                                GitHub:
                                &nbsp;
                                <a href="https://docs.github.com/en/github/site-policy/github-privacy-statement" className="underline">
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                            <li>
<<<<<<< HEAD
=======
                                Ko-fi:
                                &nbsp;
                                <a href="https://more.ko-fi.com/privacy" className="underline">
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                            <li>
>>>>>>> 68387b1eaef1fe256d04b3c888afb61967115ccf
                                Gmail/Google:
                                &nbsp;
                                <a href="https://policies.google.com/privacy?hl=fi-FI" className="underline">
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                            <li>
                                {t('privacy:appleSync')}:
                                &nbsp;
<<<<<<< HEAD
                                <a href="https://www.apple.com/fi/legal/privacy/fi/" className="underline">
=======
                                <a href="https://www.apple.com/legal/privacy/en-ww/" className="underline">
>>>>>>> 68387b1eaef1fe256d04b3c888afb61967115ccf
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            }/>
        }/>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['index', 'privacy', 'common'])),
        },
    };
}

export default Privacy;