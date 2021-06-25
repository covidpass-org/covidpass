import Icon from '../public/favicon.svg'

export default Logo

function Logo() {
  return (
    <div className="flex flex-row items-center p-3 justify-center space-x-1" >
      <Icon />
      <h1 className="text-3xl font-bold">
        CovidPass
      </h1>
    </div>
  )
}