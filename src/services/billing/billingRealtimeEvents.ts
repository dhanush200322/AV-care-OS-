import type { PaymentSuccessEvent } from './unifiedInvoice.types';

export const PAYMENT_SUCCESS_EVENT = 'PAYMENT_SUCCESS_EVENT';
export const PAYMENT_SUCCESS_EVENT_NAME = 'avcare:billing:payment-success';

export const dispatchPaymentSuccessEvent = (event: PaymentSuccessEvent) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(PAYMENT_SUCCESS_EVENT_NAME, { detail: event }));
};
