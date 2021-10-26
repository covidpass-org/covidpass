import * as SentryModule from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initSentry = () => {
    SentryModule.init({
        release: 'grassroots_covidpass@2.2.5', // App version. Needs to be manually updated as we go unless we make the build smarter
        dsn: 'https://51370d7af0994761b465bc148129c1de@o997324.ingest.sentry.io/5955697',  // this is the sponsored account for use going forward
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
