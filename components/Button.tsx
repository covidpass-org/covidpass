interface ButtonProps {
  text?: string,
  icon?: string,
  onClick: () => void,
}

function Button(props: ButtonProps): JSX.Element {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className="focus:outline-none h-20 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md items-center flex justify-center">
            {
                props.icon && <img src={props.icon} className="w-12 h-12 mr-2 -ml-4" />
            }
            {props.text}
        </button>
    )
}

export default Button;