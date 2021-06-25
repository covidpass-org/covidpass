import Form from '../components/Form'
import Logo from '../components/Logo'
import Card from '../components/Card'
import Page from '../components/Page'

export default function Home() {
  return (
    <Page content={
      <div>
        <main className="flex flex-col">
          <Logo />

          <Card content={
            <p>
              Convert any EU Digital Covid Certificate into a pass in your wallet app. On iOS, please use the Safari Browser.
            </p>
          } />

          <Form className="flex-grow" />
          
          <footer>
            <nav className="nav flex space-x-5 m-6 flex-row-reverse space-x-reverse text-md font-bold">
              <a href="/privacy" className="hover:underline" >Privacy Policy</a>
              <a href="/imprint" className="hover:underline" >Imprint</a>
            </nav>
          </footer>
        </main>
      </div>
    } />
  )
}
