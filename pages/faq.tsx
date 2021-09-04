import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Faq(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'faq']);
    const questionList = [
      {description: 'Why have we taken time to build this?', answer: 'Gives Ontarians/organizations something very easy to use in the interim.', key: 1},
      {description: 'Who made this?', answer: 'The same group of volunteers (Billy, Ryan, Evert, Jason, Anujan, Lisa) who created the public the integrated vaccine appointment finding tool at vaccine-ontario.ca.', key: 2},
      {description: 'How is the data on my vaccination receipt processed?', answer: 'It checks the receipt for an official signature from the province. If present, the receipt data is converted into Apple\'s format and then added into your iOS Wallet app.', key: 3},
      {description: 'How can organizations validate the QR code?', answer: 'Just aim your standard camera app (iPhone/Android) at the code, and it will bring up a web page that shows the verification result.', key: 4},
      {description: 'Is this free and private?', answer: 'Similar to VaxHunters, this is not backed by any commerical businesses. Just volunteers trying to do our part to help the community.', key: 5},
      {description: 'Should I use the official provincial apps when they come out on 22nd October?', answer: 'YES. This is mainly created to fill in the gap, so schools/workplaces have something simple to use in the interim.', key: 6},
      {description: 'Will this work on Android?', answer: 'Yes. If healthcare organizations is willing to support us, we can do the same for Google\'s wallet too. Your voice matters.', key: 7},
      {description: 'I have more questions. Can you help?', answer: 'Sure. Just email us at grassroots@vaccine-ontario.ca.', key: 8}
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