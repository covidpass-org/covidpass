import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Faq(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'faq']);
    const questionList = [
      {description: 'Why have we taken time to build this?', answer: 'Gives the public something very easy to use before school year gets under way. #SafetyMatters', key: 1},
      {description: 'Who built this?', answer: 'The same group of volunteers (Billy, Ryan, Evert, Jason, Anujan, Lisa) who brought the public the integrated vaccine appointment finding tool at vaccine-ontario.ca.', key: 2},
      {description: 'Do you know CSS?', key: 3}
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