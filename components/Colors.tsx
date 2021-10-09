import React, {useState} from 'react'
import {RadioGroup} from '@headlessui/react'
import {COLORS, rgbToHex} from "../src/colors";

interface ColorsProps {
    initialValue: COLORS,
    onChange(value: COLORS): void;
}

function Colors(props: ColorsProps): JSX.Element {
    let [color, setColor] = useState(props.initialValue)

    return (
        <RadioGroup<"div", COLORS> 
            className="flex flex-wrap" value={color}
            onChange={function (value) {
                setColor(value);
                props.onChange(value);
            }
        }>
            {Object.values(COLORS).map((color) => {
                return (
                    <RadioGroup.Option value={color} key={color} className="outline-none">
                        {({checked}) => (
                            <div
                                key={color}
                                className={`${color !== COLORS.WHITE ? 'ring-white' : 'ring-black'} ring-2 shadow-xl cursor-pointer rounded-md w-10 h-10 flex items-center justify-center m-2`}
                                style={{backgroundColor: rgbToHex(color), WebkitAppearance: 'none'}}
                            >
                                {checked &&
                                    <svg className={`${color !== COLORS.WHITE ? 'text-white' : 'text-black'} h-6 w-6`} fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                                    </svg>
                                }
                            </div>
                        )}
                    </RadioGroup.Option>
                )
            })}
        </RadioGroup>
    )
}

export default Colors;