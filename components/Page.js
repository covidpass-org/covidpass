import Head from 'next/head'

export default Page

function Page({content}) {
  return (
    <div className="lg:w-1/3 lg:mx-auto flex flex-col min-h-screen justify-center md:px-12 py-12">
      <Head>
        <title>CovidPass</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      {content}
    </div>
  )
}