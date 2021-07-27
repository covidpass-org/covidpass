import {useTranslation} from 'next-i18next';

interface CheckProps {
    text: string;
}

function Check(props: CheckProps): JSX.Element {
  const { t } = useTranslation(["index"]);

  return (
    <li className="flex flex-row space-x-4 items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 fill-current text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      {props.text}
      </li>
  )
}

export default Check;