import * as SentryModule from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initSentry = () => {
    SentryModule.init({
        release: 'grassroots_covidpass@1.8.0', // App version. Needs to be manually updated as we go unless we make the build smarter
        integrations: [
            new Integrations.BrowserTracing(),
        ],
        attachStacktrace: true
    });
    console.log('sentry initialized');

;};
