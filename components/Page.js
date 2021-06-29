import Head from 'next/head'
import Logo from './Logo'
import Link from 'next/link'

export default Page

function Page({ content }) {
  return (
    <div className="md:w-2/3 xl:w-2/5 md:mx-auto flex flex-col min-h-screen justify-center px-5 py-12">
      <Head>
        <title>CovidPass</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div>
        <main className="flex flex-col space-y-5">
          <Logo />

          {content}

          <footer>
            <nav className="nav flex pt-4 flex-row space-x-4 justify-center text-md font-bold">
              <a href="https://www.paypal.com/paypalme/msextro" className="hover:underline" >Donate</a>
              <a href="https://github.com/marvinsxtr/covidpass" className="hover:underline" >GitHub</a>
              <Link href="/privacy"><a className="hover:underline" >Privacy Policy</a></Link>
              <Link href="/imprint"><a className="hover:underline" >Imprint</a></Link>
            </nav>
          </footer>
        </main>
      </div>
    </div>
  )
}