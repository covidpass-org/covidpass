interface CardProps {
    heading?: string,
    step?: string,
    content: JSX.Element,
}

function Card(props: CardProps): JSX.Element {
    return (
        <div className="rounded-md p-6 bg-white dark:bg-gray-800 space-y-4">
            {
                props.step &&
                <div className="flex flex-row items-center">
                    <div className="rounded-full p-4 bg-green-600 h-5 w-5 flex items-center justify-center">
                        <p className="text-white text-lg font-bold">
                            {props.step}
                        </p>
                    </div>
                    <div className="ml-3 font-bold text-xl">
                        {props.heading}
                    </div>
                </div>
            }
            <div className="text-lg">
                {props.content}
            </div>
        </div>
    )
}

export default Card;