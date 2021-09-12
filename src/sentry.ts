import * as SentryModule from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initSentry = () => {
    SentryModule.init({
        dsn: 'https://eQQAQX2SsudxcM@o997324.ingest.sentry.io/5955697',
        release: 'grassroots_covidpass@1.4.0', // App version. Needs to be manually updated as we go unless we make the build smarter
        integrations: [
            new Integrations.BrowserTracing(),
        ],
    });
;};
