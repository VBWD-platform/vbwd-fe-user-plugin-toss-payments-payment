import type { IPlugin, IPlatformSDK } from 'vbwd-view-component';
import en from './locales/en.json';
import ko from './locales/ko.json';

export const tossPaymentsPlugin: IPlugin = {
  name: 'toss-payments-payment',
  version: '1.0.0',
  description: 'Toss Payments (Korea) — widget checkout + cash receipt',
  _active: false,

  install(sdk: IPlatformSDK) {
    sdk.addRoute({
      path: '/pay/toss',
      name: 'toss-payment',
      component: () => import('./TossPaymentView.vue'),
      meta: { requiresAuth: true, noLayout: true },
    });
    sdk.addRoute({
      path: '/pay/toss/success',
      name: 'toss-success',
      component: () => import('./TossSuccessView.vue'),
      meta: { requiresAuth: true, noLayout: true },
    });
    sdk.addRoute({
      path: '/pay/toss/cancel',
      name: 'toss-cancel',
      component: () => import('./TossCancelView.vue'),
      meta: { requiresAuth: true, noLayout: true },
    });

    sdk.addTranslations('en', en);
    sdk.addTranslations('ko', ko);
  },

  activate() { this._active = true; },
  deactivate() { this._active = false; },
};
