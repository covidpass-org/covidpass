import * as SentryModule from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initSentry = () => {
    SentryModule.init({
        release: 'grassroots_covidpass@2.1.2', // App version. Needs to be manually updated as we go unless we make the build smarter
        dsn: 'https://7120dcf8548c4c5cb148cdde2ed6a778@o1015766.ingest.sentry.io/5981424',
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
