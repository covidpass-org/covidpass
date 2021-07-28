import React, {useState} from 'react'
import {RadioGroup} from '@headlessui/react'
import ColorOption from "./color_selector/ColorOption";
import {COLORS} from "../src/colors";

interface ColorSelectorProps {
    initialValue: COLORS,

    onChange(value: COLORS): void;

}

function ColorSelector(props: ColorSelectorProps): JSX.Element {
    let [color, setColor] = useState(props.initialValue)

    return (
        <RadioGroup<"div", COLORS> className="flex items-center flex-wrap" value={color}
                                   onChange={function (value) {
                                       setColor(value);
                                       props.onChange(value);
                                   }}>
            <ColorOption color={COLORS.WHITE}/>
            <ColorOption color={COLORS.BLACK}/>
            <ColorOption color={COLORS.GREY}/>
            <ColorOption color={COLORS.GREEN}/>
            <ColorOption color={COLORS.INDIGO}/>
            <ColorOption color={COLORS.BLUE}/>
            <ColorOption color={COLORS.PURPLE}/>
            <ColorOption color={COLORS.TEAL}/>
        </RadioGroup>
    )
}

export default ColorSelector