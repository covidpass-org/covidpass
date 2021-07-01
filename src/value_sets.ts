interface ValueTypes {
    medicalProducts: string;
    countryCodes: string;
    manufacturers: string;
}

export class ValueSets {
    private static VALUE_SET_BASE_URL: string = 'https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-valuesets/main/';
    private static VALUE_TYPES: ValueTypes = {
        medicalProducts: 'vaccine-medicinal-product.json',
        countryCodes: 'country-2-codes.json',
        manufacturers: 'vaccine-mah-manf.json',
    }

    medicalProducts: object;
    countryCodes: object;
    manufacturers: object;


    private constructor(medicalProducts: object, countryCodes: object, manufacturers: object) {
        this.medicalProducts = medicalProducts;
        this.countryCodes = countryCodes;
        this.manufacturers = manufacturers;
    }

    public static async loadValueSets(): Promise<ValueSets> {
        // Load all Value Sets from GitHub
        let medicalProducts = await (await fetch(ValueSets.VALUE_SET_BASE_URL + ValueSets.VALUE_TYPES.medicalProducts)).json();
        let countryCodes = await (await fetch(ValueSets.VALUE_SET_BASE_URL + ValueSets.VALUE_TYPES.countryCodes)).json();
        let manufacturers = await (await fetch(ValueSets.VALUE_SET_BASE_URL + ValueSets.VALUE_TYPES.manufacturers)).json();

        return new ValueSets(medicalProducts['valueSetValues'], countryCodes['valueSetValues'], manufacturers['valueSetValues']);
    }
}