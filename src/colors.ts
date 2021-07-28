export enum COLORS {
    WHITE = 'rgb(255, 255, 255)',
    BLACK = 'rgb(0, 0, 0)',
    GREY = 'rgb(33, 33, 33)',
    GREEN = 'rgb(27, 94, 32)',
    INDIGO = 'rgb(26, 35, 126)',
    BLUE = 'rgb(1, 87, 155)',
    PURPLE = 'rgb(74, 20, 140)',
    TEAL = 'rgb(0, 77, 64)',
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