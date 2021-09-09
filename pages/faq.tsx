import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Faq(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'faq']);
    const questionList = [
      {description: 'Which version of iOS does this support?', answer: 'iOS 14.0 is the minimum at the moment. We are looking for adjustments for older iOSes, but it will take a bit of time.', key: 1},
      {description: 'Why have we taken time to build this?', answer: 'Gives Ontarians/organizations something very easy to verify vaccination status.', key: 2},
      {description: 'Who made this?', answer: 'The same group of volunteers (Billy Lo, Ryan Slobojan, Evert Timberg, Jason Liu, Anujan Mathisekaran, Lisa Discepola, Samantha Finn, Madison Pearce) who created the all-in-one vaccine appointment finding tool at vaccine-ontario.ca.', key: 3},
      {description: 'How is the data on my vaccination receipt processed?', answer: 'It checks the receipt for an official signature from the province. If present, the receipt data is converted into Apple\'s format and then added into your iOS Wallet app.', key: 4},
      {description: 'How can organizations validate the QR code?', answer: 'Just aim your standard camera app (iPhone/Android) at the code, and it will bring up a web page that shows the verification result.', key: 5},
      {description: 'Is this free and private?', answer: 'Similar to VaxHunters, this is not backed by any commerical businesses. Just volunteers trying to do our part to help the community.', key: 6},
      {description: 'Should I use the official provincial apps when they come out on 22nd October?', answer: 'YES. This is an extra avenue intended to augment the official efforts.', key: 7},
      {description: 'Do you have plans for Android support?', answer: 'Yes. We are working with Google to gain access to the APIs required.', key: 8},
      {description: 'I have more questions. Can you help?', answer: 'Sure. Just email us at grassroots@vaccine-ontario.ca.', key: 9}
    ];


    return (
        <Page content={
            <Card step="§" heading={t('common:faq')} content={
                <div className="space-y-3">
                    <p className="font-bold">{t('faq:heading')}</p>
                    <ol>
                        {questionList.map(question => {
                        return (
                            <div>
                                <li key={question.key}><b>{question.key}. {question.description}</b></li>
                                <li key={question.key}>{question.answer}</li>
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