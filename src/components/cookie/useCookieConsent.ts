import React from 'react';
import { CookieConsentContext } from './CookieConsentProvider';

export const useCookieConsent = () => {
  const context = React.useContext(CookieConsentContext);

  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider.');
  }

  return context;
};
