import * as SentryModule from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initSentry = () => {
    SentryModule.init({
        release: 'grassroots_covidpass@1.9.18', // App version. Needs to be manually updated as we go unless we make the build smarter
        dsn: 'https://7120dcf8548c4c5cb148cdde2ed6a778@o1015766.ingest.sentry.io/5981424',
        integrations: [
            new Integrations.BrowserTracing(),
        ],
        ignoreErrors: [
          'cancelled',
          'invalidFileType'
        ],
        attachStacktrace: true,
        tracesSampleRate: 0.5

    });
    console.log('sentry initialized');

;};
