import {useTranslation} from 'next-i18next';

interface BulletProps {
    text: string;
}

function Bullet(props: BulletProps): JSX.Element {
  const { t } = useTranslation(["index"]);

  return (
      <li className="flex flex-row space-x-4 items-center">
          <svg className="h-5 w-5 mx-2 fill-current text-green-500" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle fillRule="evenodd" clipRule="evenodd" cx="10" cy="10" r="5" />
          </svg>
          {props.text}
      </li>
  )
}

export default Bullet;