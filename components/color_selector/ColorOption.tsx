import {RadioGroup} from '@headlessui/react'
import {COLORS, rgbToHex} from "../../src/colors";

interface ColorOptionProps {
    color: COLORS,
}

function ColorOption(props: ColorOptionProps): JSX.Element {

    let colorIsDark = props.color != COLORS.WHITE;

    return (
        <RadioGroup.Option
            value={props.color}>
            {({checked}) => (
                <div
                    className={`${colorIsDark ? 'border-white' : 'border-black'} border-2 cursor-pointer rounded-full w-9 h-9 flex items-center justify-center m-1`}
                    style={{backgroundColor: rgbToHex(props.color)}}>
                    {checked &&
                    <svg className={`${colorIsDark ? 'text-white' : 'text-black'} h-5 w-5`} fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    }
                </div>
            )}
        </RadioGroup.Option>
    )
}

export default ColorOption
