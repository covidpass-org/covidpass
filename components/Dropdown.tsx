import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


interface DropdownProps {
    label: string,
    options: { label: string, value: string }[]
}

export default function Dropdown(props: DropdownProps) {
    const { label, options } = props;
    return (
        <Menu as="div" className="relative inline-block text-left w-full">
            <Menu.Button className="inline-flex justify-center w-full  bg-green-600 py-2 px-3 text-white font-semibold rounded-md disabled:bg-gray-400">
                {label}
                <svg className=" h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-left w-full absolute left-0 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 ">
                    <div className="py-1">
                        {options.map((option, i) => (
                            <Menu.Item key={i}>
                                {({ active }) => (
                                    <a
                                        href={option.value}
                                        className={classNames(
                                            active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900' : 'text-gray-700',
                                            'dark:text-white block px-4 py-2'
                                        )}
                                    >
                                        {option.label}
                                    </a>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}