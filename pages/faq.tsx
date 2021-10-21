import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

interface link{
    url: string;
    text: string;
}

function linkToJSX(link: link): JSX.Element {
    return <div style={{ display: 'inline' }} dangerouslySetInnerHTML={{ __html: `<a href="${link.url}" target="_blank" class="underline">${link.text}</a>` }}></div>
}

function urlParse(text: string, links: link[]): JSX.Element[] {
    const el = text.split(/(%s)/).map(s => {
        if (s.includes("%s")) {
            return linkToJSX(links.shift());
        } else {
            return <>{s}</>
        }
    });
    return el;
}


const CONSTANTS = {
    grassrootsEmail: { url: 'mailto:grassroots@vaccine-ontario.ca', text: 'grassroots@vaccine-ontario.ca' },
    verifier: { url: 'https://verifier.vaccine-ontario.ca/', text: 'verifier.vaccine-ontario.ca' },
    twitter: { url: 'https://twitter.com/grassroots_team', text: '@grassroots_team' },
    booking: { url: 'https://vaccine-ontario.ca/', text: 'vaccine-ontario.ca' },
    verifyOntarioApp: { url: 'https://covid-19.ontario.ca/verify', text: 'Verify Ontario app' },
    vaxHunters: { url: 'https://vaccinehunters.ca/', text: 'Vaccine Hunters Canada' },
    googlePayApp: { url: 'https://pay.app.goo.gl/gettheapp-en-ca', text: 'Google Play Store' }
}

function Faq(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'faq']);
    const questionList = [
      {description: t('faq:iosSupportQ'), answer: t('faq:iosSupportA')},
      {description: t('faq:androidSupportQ'), answer: t('faq:androidSupportA')},
      {description: t('faq:olderIPhoneQ'), answer: t('faq:olderIPhoneA')},
      {description: t('faq:qrSmallQ'), answer: t('faq:qrSmallA')},
      {description: t('faq:browsersQ'), answer: t('faq:browsersA')},
      {description: t('faq:privateInfoQ'), answer: t('faq:privateInfoA')},
      {description: t('faq:samsungQ'), answer: urlParse(t('faq:samsungA'), [CONSTANTS.googlePayApp])},
      {description: t('faq:redWhiteQ'), answer: t('faq:redWhiteA')},
      {description: t('faq:noOhipQ'), answer: t('faq:noOhipA')},
      {description: t('faq:colourQ'), answer: t('faq:colourA')},
      {description: t('faq:dataQ'), answer: t('faq:dataA')},
      {description: t('faq:verifyQ'), answer: urlParse(t('faq:verifyA'),[CONSTANTS.verifyOntarioApp])},
      {description: t('faq:familyQ'), answer: t('faq:familyA')},
      {description: t('faq:freeQ'), answer: urlParse(t('faq:freeA'),[CONSTANTS.vaxHunters])},
      {description: t('faq:otherProvincesQ'), answer: urlParse(t('faq:otherProvincesA'), [CONSTANTS.grassrootsEmail])},
      {description: t('faq:appleWatchQ'), answer: t('faq:appleWatchA')},
      {description: t('faq:whyQ'), answer: t('faq:whyA')},
      {description: t('faq:whoQ'), answer: urlParse(t('faq:whoA'), [CONSTANTS.booking])},
      {description: t('faq:updatesQ'), answer: urlParse(t('faq:updatesA'), [CONSTANTS.twitter])},
      {description: t('faq:moreQuestionsQ'), answer: urlParse(t('faq:moreQuestionsA'), [CONSTANTS.grassrootsEmail]) }
    ];

    return (
        <Page content={
            <Card step="?" heading={t('common:faq')} content={
                <div className="space-y-3">
                    <p className="font-bold">{t('faq:heading')}</p>
                    <ol>
                        {questionList.map((question, i) => {
                        return (
                            <div>
                                <li key={i}><b>{i+1}. {question.description}</b></li>
                                <li key={i}>{question.answer}</li>
                                <br></br>
                            </div>
                        );
                        })}
                    </ol>

                </div>
            }/>
        }/>
    )
}

export async function getStaticProps({ locale }) {
    return { 
        props: { 
            ...(await serverSideTranslations(locale, ['index', 'faq', 'common']))
        }
    }
}

export default Faq;