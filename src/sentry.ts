import * as SentryModule from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initSentry = () => {
    SentryModule.init({
        release: 'grassroots_covidpass@1.10.0', // App version. Needs to be manually updated as we go unless we make the build smarter
        dsn: "https://e0c718835ae148e2b3bbdd7037e17462@o997319.ingest.sentry.io/6000731",

        integrations: [
            new Integrations.BrowserTracing(),
        ],
        ignoreErrors: [
          'cancelled',
          'annulé',
          '已取消',
          'invalidFileType',
          'request timed out',
          'blocked by content blocker',
          'Failed to fetch',
          'network connection was lost'
        ],
        attachStacktrace: true,
        tracesSampleRate: 1.0

    });
    console.log('sentry initialized');

;};
