import Page from '../components/Page'
import Card from '../components/Card'

export default function Imprint() {
  return(
    <Page content={
      <Card step="§" heading="Imprint" content={
        <div className="space-y-2">
          <p className="font-bold">Information according to § 5 TMG</p>
          <p>
            Marvin Sextro<br />
            Wilhelm-Busch-Str. 8A<br />
            30167 Hannover<br />
          </p>
          <p className="font-bold">Contact</p>
          <p>
            marvin.sextro@gmail.com
          </p>
          <p className="font-bold">EU Dispute Resolution</p>
          <p>
            The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr" className="underline">https://ec.europa.eu/consumers/odr</a>. You can find our e-mail address in the imprint above.
          </p>
          <p className="font-bold">Consumer dispute resolution / universal arbitration board</p>
          <p>
            We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
          </p>
          <p className="font-bold">Liability for contents</p>
          <p>
          As a service provider, we are responsible for our own content on these pages in accordance with § 7 paragraph 1 TMG under the general laws. According to §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under the general laws remain unaffected. However, liability in this regard is only possible from the point in time at which a concrete infringement of the law becomes known. If we become aware of any such infringements, we will remove the relevant content immediately.
          </p>
          <p className="font-bold">Liability for links</p>
          <p>
            Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the sites is always responsible for the content of the linked sites. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking. However, a permanent control of the contents of the linked pages is not reasonable without concrete evidence of a violation of the law. If we become aware of any infringements, we will remove such links immediately.
          </p>
          <p className="font-bold">Credits</p>
          <p>
            With excerpts from: https://www.e-recht24.de/impressum-generator.html
            Translated with www.DeepL.com/Translator (free version)
          </p>
        </div>
      }/>
    }/>
  )
}