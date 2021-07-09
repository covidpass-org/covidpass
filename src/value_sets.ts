interface ValueTypes {
    medicalProducts: string;
    countryCodes: string;
    manufacturers: string;
    testResults: string;
    testTypes: string;
}

export class ValueSets {
    private static VALUE_SET_BASE_URL: string = 'https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-valuesets/main/';
    private static VALUE_TYPES: ValueTypes = {
        medicalProducts: 'vaccine-medicinal-product.json',
        countryCodes: 'country-2-codes.json',
        manufacturers: 'vaccine-mah-manf.json',
        testResults: 'test-result.json',
        testTypes: 'test-type.json',
    }

    medicalProducts: object;
    countryCodes: object;
    manufacturers: object;
    testResults: object;
    testTypes: object;

    private constructor(
        medicalProducts: object, 
        countryCodes: object, 
        manufacturers: object, 
        testResults: object, 
        testTypes: object
    ) {
        this.medicalProducts = medicalProducts;
        this.countryCodes = countryCodes;
        this.manufacturers = manufacturers;
        this.testResults = testResults;
        this.testTypes = testTypes;
    }

    private static async fetchValueSet(file: string): Promise<object> {
        return await (await fetch(ValueSets.VALUE_SET_BASE_URL + file)).json();
    }

    public static async loadValueSets(): Promise<ValueSets> {
        // Load all Value Sets from GitHub
        let [medicalProducts, countryCodes, manufacturers, testResults, testTypes] = await Promise.all([
            ValueSets.fetchValueSet(ValueSets.VALUE_TYPES.medicalProducts),
            ValueSets.fetchValueSet(ValueSets.VALUE_TYPES.countryCodes),
            ValueSets.fetchValueSet(ValueSets.VALUE_TYPES.manufacturers),
            ValueSets.fetchValueSet(ValueSets.VALUE_TYPES.testResults),
            ValueSets.fetchValueSet(ValueSets.VALUE_TYPES.testTypes)
        ]);

        return new ValueSets(
            medicalProducts['valueSetValues'], 
            countryCodes['valueSetValues'], 
            manufacturers['valueSetValues'],
            testResults['valueSetValues'],
            testTypes['valueSetValues']
        );
    }
}
