// Accessible colors from https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color

export enum COLORS {
    WHITE = 'rgb(255, 255, 255)',
    BLACK = 'rgb(0, 0, 0)',
    GREY = 'rgb(36, 36, 38)',
    BLUE = 'rgb(0, 64, 221)',
    BROWN = 'rgb(127, 101, 69)',
    CYAN = 'rgb(0, 113, 164)',
    GREEN = 'rgb(36, 138, 61)',
    INDIGO = 'rgb(54, 52, 163)',
    MINT = 'rgb(12, 129, 123)',
    ORANGE = 'rgb(201, 52, 0)',
    PINK = 'rgb(211, 15, 69)',
    PURPLE = 'rgb(137, 68, 171)',
    RED = 'rgb(215, 0, 21)',
    TEAL = 'rgb(0, 130, 153)',
    YELLOW = 'rgb(178, 80, 0)'
}

export function rgbToHex(rgbString: string) {
    let a = rgbString.split("(")[1].split(")")[0];
    let values = a.split(",");

    let b = values.map(function (value) {
        let x = parseInt(value).toString(16);
        return (x.length == 1) ? "0" + x : x;
    })

    return "#" + b.join("");
}