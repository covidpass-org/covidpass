import Icon from '../public/favicon.svg'
import Link from 'next/link'

export default Logo

function Logo() {
  return (
    <Link href="/">
      <a className="flex flex-row items-center p-3 justify-center space-x-1" >
        <Icon className="fill-current" />
        <h1 className="text-3xl font-bold">
          CovidPass
        </h1>
      </a>
    </Link>
  )
}