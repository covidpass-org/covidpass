import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Imprint(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'imprint']);

    return (
        <Page content={
            <Card step="§" heading={t('common:imprint')} content={
                <div className="space-y-3">
                    <p className="font-bold">{t('imprint:heading')}</p>
                    <p>
                        Marvin Sextro<br />
                        Kopenhagener Straße 45<br />
                        10437 Berlin
                    </p>
                    <p className="font-bold">{t('imprint:contact')}</p>
                    <p>
                        <a href="mailto:covidpass@marvinsextro.de" className="underline">covidpass@marvinsextro.de</a>
                    </p>
                    <p className="font-bold">{t('imprint:euDisputeResolution')}</p>
                    <p>{t('imprint:euDisputeResolutionParagraph')}</p>
                    <p className="font-bold">{t('imprint:consumerDisputeResolution')}</p>
                    <p>{t('imprint:consumerDisputeResolutionParagraph')}</p>
                    <p className="font-bold">{t('imprint:liabilityForContents')}</p>
                    <p>{t('imprint:liabilityForContentsParagraph')}</p>
                    <p className="font-bold">{t('imprint:liabilityForLinks')}</p>
                    <p>{t('imprint:liabilityForLinksParagraph')}</p>
                    <p className="font-bold">{t('imprint:credits')}</p>
                    <p>
                        {t('imprint:creditsSource')}
                        <br />
                        {t('imprint:creditsTranslation')}
                    </p>
                </div>
            }/>
        }/>
    )
}

export async function getStaticProps({ locale }) {
    return { 
        props: { 
            ...(await serverSideTranslations(locale, ['index', 'imprint', 'common']))
        }
    }
}

export default Imprint;