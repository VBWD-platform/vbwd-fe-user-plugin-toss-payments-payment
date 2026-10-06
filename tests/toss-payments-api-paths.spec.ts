/**
 * Regression: the host api client already carries baseURL `/api/v1`, so the
 * view must pass paths relative to it. A `/api/v1/...` literal produced
 * `/api/v1/api/v1/...` -> 404 in production.
 *
 * The fake sits at the transport (axios adapter) so the asserted path is the
 * one that would actually hit the wire.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { api } from '@/api';
import TossSuccessView from '../TossSuccessView.vue';

const { routeQuery } = vi.hoisted(() => ({
  routeQuery: { paymentKey: 'pk-1', orderId: 'INV-1', amount: '15000' },
}));
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: routeQuery }),
}));

// The production baseURL (vue/src/api/index.ts fallback); pinned so a local
// VITE_API_URL override cannot mask a doubled prefix.
const PRODUCTION_BASE_URL = '/api/v1';
const requestedPaths: string[] = [];

function installFakeTransport(responseFor: (path: string) => unknown): void {
  const transport = (api as unknown as { axiosInstance: AxiosInstance }).axiosInstance;
  transport.defaults.baseURL = PRODUCTION_BASE_URL;
  transport.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    const path = `${config.baseURL ?? ''}${config.url ?? ''}`;
    requestedPaths.push(path);
    return { data: responseFor(path), status: 200, statusText: 'OK', headers: {}, config };
  };
}

describe('TossSuccessView api paths', () => {
  beforeEach(() => {
    requestedPaths.length = 0;
    installFakeTransport(() => ({ status: 'DONE' }));
  });

  it('confirms the payment on the single-prefixed backend route without error', async () => {
    const wrapper = mount(TossSuccessView, {
      global: { mocks: { $t: (key: string) => key }, stubs: { RouterLink: true } },
    });
    await flushPromises();

    expect(requestedPaths).toEqual(['/api/v1/plugins/toss-payments/payments/confirm']);
    expect(wrapper.find('.error').exists()).toBe(false);
  });
});
