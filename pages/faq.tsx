import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Faq(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'faq']);
    const questionList = [
      {description: 'Which version of iOS does this support?', answer: 'iOS 13.7 is the minimum at the moment. We are looking for adjustments for older iOS versions, but it will take a bit of time.'},
      {description: 'I\'m having issues with adding it to my iPhone 6.', answer: 'Unfortunately, the iPhone 6 supports up to iOS 12 while the minimum requirement for our app is iOS 13.7 however, we are looking for ways around this to make it more accessible. In the meantime you can try it on a computer or another device and save it as either a wallet card or a photo - if you save it as a card, you can then email it to your iPhone and you will be able to import it into Apple Wallet that way.'},
      {description: "What are the supported browsers?", answer: 'For iPhones, only Safari is supported for importing to your Apple Wallet. For any other devices, we recommend that you save it as photo using your browser of choice. Browsers built internally into mobile apps (e.g. Facebook, Twitter, Instagram) are known to have issues.'},
      {description: "How is my private information handled?", answer: 'Your proof-of-vaccination PDF (and most of the information in it) never leaves your device, and does NOT get sent to our server - the only information we send and store is non-personally-identifiable information such as vaccine type, date, and which organization gave you the vaccine. We share your concern about personal data being stored and lost, which is why we chose not to store or send any of it to our servers so there is no chance of it being lost or leaked.'},
      {description: 'Do you have plans for Android support?', answer: 'Yes. We are working with Google to gain access to the APIs required. Meanwhile, you can also use this tool to download an Apple Wallet pass and import that into Google Pay Wallet using apps such as Pass2Pay or simply save it as a photo.'},
      {description: 'I have a Red/White OHIP card. Can I still use this tool?', answer: 'Yes you can! Just call the Provincial Vaccine Contact Centre at 1-833-943-3900. The call centre agent can email you a copy of the receipt.'},
      {description: 'I dont\'t have a health card. Can I still use this tool?', answer: 'First contact your local public health unit to verify your identity and receive a COVIDcovid ID/Personal Access Code. You can then call the Provincial Vaccine Contact Centre at 1-833-943-3900 to get an email copy of your receipt.'},
      {description: 'I\'m seeing an error message saying “Failed byte range verification." What do I do?', answer: 'If you see this error then please try re-downloading your receipt from the provincial proof-of-vaccination portal and trying again. We have received reports from some people that this has resolved the problem for them.'},
      {description: 'What does the colour of the Apple Wallet pass mean?', answer: 'Dose 1 is shown as Orange; dose 2+ in green for easy differentiation without reading the text. For the Janssen (Johnson & Johnson) vaccine, dose 1 is shown as green.'},
      {description: 'Should I use the official provincial apps when they come out on 22nd October?', answer: 'YES. Once the official QR code from the province is available, please come back to this site and you will be able to generate a new vaccination receipt which uses that new QR code'},
      {description: 'How is the data on my vaccination receipt processed?', answer: 'Inside your local web browser, it checks the receipt for a digital signature from the provincial proof-of-vaccination system. If present, the receipt data is converted into Apple\'s format and then added into your iOS Wallet app.'},
      {description: 'How can organizations validate this QR code?', answer: 'You can use our verifier app at verifier.vaccine-ontario.ca to verify these passes quickly if you are a business - you should also be able to use any normal QR code scanner to scan this code and it will take you to a verification site which tells you whether the receipt is valid or not'},
      {description: 'Can I use the same iPhone to store passes for my entire family?', answer: 'Yes.'},
      {description: 'Is this free and non-commercial?', answer: 'Similar to VaxHuntersCanada, there are no commercial interests. Just volunteers trying to do our part to help the community.'},
      {description: 'How about support for other provinces?', answer: 'We will be investigating BC and Québec support shortly. If you are interested in contributing, please email us at grassroots@vaccine-ontario.ca'},
      {description: 'How about Apple Watch?', answer: 'If you have iCloud sync enabled, you will see the pass on the watch too.'},
      {description: 'Why have we taken time to build this?', answer: 'Gives Ontarians/organizations something easy to use (volunteered-developed, unofficial) until the official provincial app comes out in October.'},
      {description: 'Who made this?', answer: 'The same group of volunteers who created the all-in-one vaccine appointment finding tool at vaccine-ontario.ca'},
      {description: 'How can I stay up-to-date on your progress?', answer: 'We will post regular updates on Twitter @grassroots_team'},
      {description: 'I have more questions. Can you please help me?', answer: 'Sure. Just email us at grassroots@vaccine-ontario.ca'}
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