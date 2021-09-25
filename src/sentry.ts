import * as SentryModule from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initSentry = () => {
    SentryModule.init({
        release: 'grassroots_covidpass@1.9.6', // App version. Needs to be manually updated as we go unless we make the build smarter
        dsn: 'https://51370d7af0994761b465bc148129c1de@o997324.ingest.sentry.io/5955697',
        integrations: [
            new Integrations.BrowserTracing(),
        ],
        attachStacktrace: true
    });
    console.log('sentry initialized');

;};
