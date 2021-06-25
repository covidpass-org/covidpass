import Page from '../components/Page'
import Card from '../components/Card'

export default function Privacy() {
  return(
    <Page content={
      <Card step=" " heading="Privacy Policy" content={
        <p className="space-y-2">
          Privacy Policy
        </p>
      }/>
    }/>
  )
}