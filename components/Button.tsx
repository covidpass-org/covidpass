interface ButtonProps {
  text?: string,
  icon?: string,
  loading?: boolean,
  onClick: () => void,
}

function Button(props: ButtonProps): JSX.Element {

    function handleTouchEnd(event: React.TouchEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();
        
        props.onClick();
    }

    return (
        <button
            type="button"
            onClick={props.onClick}
            onTouchEnd={handleTouchEnd}
            className="bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 relative focus:outline-none h-20 text-white font-semibold rounded-md items-center flex justify-center">
            {
                props.icon && <img src={props.icon} className="w-12 h-12 mr-2 -ml-4" />
            }
            {props.text}
        </button>
    )
}

export default Button;