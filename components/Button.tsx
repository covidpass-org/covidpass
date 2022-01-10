interface ButtonProps {
  text?: string,
  icon?: string,
  onClick?: () => void,
  loading?: boolean,
  type?: ButtonType,
}

export enum ButtonType {
    submit = 'submit',
    button = 'button',
}

Button.defaultProps = {
    loading: false,
    type: ButtonType.button,
}

function Button(props: ButtonProps): JSX.Element {
    return (
        <button
            type={props.type}
            onMouseUp={props.onClick}
            onTouchEnd={props.onClick}
            className={`${props.type == ButtonType.submit ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500"} relative focus:outline-none h-20 text-white font-semibold rounded-md items-center flex justify-center`}>
            {
                props.icon && <img src={props.icon} className="w-12 h-12 mr-2 -ml-4" />
            }
            {
                props.type == ButtonType.submit &&
                <div id="spin" className={`${props.loading ? undefined : "hidden"} absolute left-2`}>
                    <svg className="animate-spin h-5 w-5 ml-4" viewBox="0 0 24 24">
                        <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"/>
                        <path className="opacity-80" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                </div>
            }
            {props.text}
        </button>
    )
}

export default Button;