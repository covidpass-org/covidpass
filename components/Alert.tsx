import { useTranslation } from 'next-i18next';

interface AlertProps {
    onClose?: () => void;
    type: 'error' | 'warning';
    message: string;
}

function Alert(props: AlertProps): JSX.Element {
    const { t } = useTranslation(['index', 'errors']);
    let color = 'red';
    let icon;
    switch (props.type) {
        case 'error':
            color = 'red'
            // icon = () => 
            //     <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
            break;
        case 'warning':
            color = 'yellow'
            break;
    }


    return (
        <div className={`flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-5 rounded relative`} role="alert">
            {icon && icon()}
            <span className="block sm:inline pr-6" id="message">{props.message}</span>
            {props.onClose && <span className="absolute right-0 px-4 py-3" onClick={props.onClose}>
                <svg className={`fill-current h-6 w-6 text-red-500`} role="button" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <title>{t('index:errorClose')}</title>
                    <path
                        d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
            </span>}
        </div>
    )
}

export default Alert;