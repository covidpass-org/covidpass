import React, { useEffect, useState } from 'react';

export default function usePassCount() {
    const [passCount, setPassCount] = useState<string>('');
    const hitcountHost = 'https://stats.vaccine-ontario.ca';

    useEffect(() => {
        if (passCount.length == 0) {
            getPassCount();
        }
    }, []);

    const getPassCount = async () => {
        const hitCount = await getHitCount();
        setPassCount(hitCount);
    };

    async function getHitCount() {

        try {
            const request = `${hitcountHost}/nocount?url=pass.vaccine-ontario.ca`;

            let response = await fetch(request);
            const counter = await response.text();

            return Promise.resolve(parseInt(counter, 10).toLocaleString());

        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    return passCount;
};
