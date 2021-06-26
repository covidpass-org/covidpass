export default Card

function Card({heading, content, step}) {
  return (
    <div className="rounded-3xl shadow-lg p-2 m-4">
      { step ? 
        <div className="flex flex-row items-center p-2">
          <div className="rounded-full p-4 bg-green-600 h-5 w-5 flex items-center justify-center">
            <p className="text-white text-lg font-bold">
              {step}
            </p>
          </div>
          <div className="pl-3 font-bold text-xl">
            {heading}
          </div>
        </div> :
      <p></p>}
      <div className="p-4 text-lg">
        {content}
      </div>
    </div>
  )
}