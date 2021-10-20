import type {NextApiRequest, NextApiResponse} from "next";

type ConfigData = {
    apiBaseUrl: string
    verifierHost: string
    hitcountHost: string
    registrationHost: string
    functionSuffix: string
    gpayBaseUrl: string
    gpayPassType: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ConfigData>) {
    // Return the API_BASE_URL. This Endpoint allows us to access the env Variable in client javascript

    res.status(200).json({apiBaseUrl: process.env.API_BASE_URL, verifierHost: process.env.VERIFIER_HOST, hitcountHost: process.env.HITCOUNT_HOST, registrationHost: process.env.REGISTRATION_HOST, functionSuffix: process.env.FUNCTION_SUFFIX, gpayBaseUrl: process.env.GPAY_BASE_URL, gpayPassType: process.env.GPAY_PASS_TYPE})
}

