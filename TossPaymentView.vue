<template>
  <div class="toss-payment">
    <div v-if="loading" class="toss-payment__loading">
      <p>{{ $t('toss.payment.loadingWidget') }}</p>
    </div>
    <div v-else-if="error" class="toss-payment__error">
      <p>{{ error }}</p>
    </div>
    <div id="toss-widget" class="toss-payment__widget"></div>
    <div id="toss-agreement" class="toss-payment__agreement"></div>
    <button
      v-if="widgetReady"
      class="btn btn-primary toss-payment__pay"
      @click="onPay"
    >
      {{ $t('toss.payment.pay') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const widgetReady = ref(false);

declare global {
  interface Window {
    PaymentWidget?: (clientKey: string, customerKey: string) => {
      renderPaymentMethods: (selector: string, opts: { value: number }) => void;
      renderAgreement: (selector: string) => void;
      requestPayment: (opts: Record<string, unknown>) => Promise<void>;
    };
  }
}

let widgetInstance: ReturnType<NonNullable<typeof window.PaymentWidget>> | null = null;

async function loadWidget() {
  const orderId = (route.query.order as string) || '';
  const amount = Number(route.query.amount || 0);
  const clientKey = (route.query.clientKey as string) || '';
  if (!orderId || !amount || !clientKey) {
    error.value = 'Missing orderId / amount / clientKey';
    loading.value = false;
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Toss widget'));
    document.head.appendChild(script);
  });

  if (!window.PaymentWidget) {
    error.value = 'Toss widget did not load';
    loading.value = false;
    return;
  }

  const customerKey = 'anonymous';
  widgetInstance = window.PaymentWidget(clientKey, customerKey);
  widgetInstance.renderPaymentMethods('#toss-widget', { value: amount });
  widgetInstance.renderAgreement('#toss-agreement');
  widgetReady.value = true;
  loading.value = false;
}

async function onPay() {
  if (!widgetInstance) return;
  const orderId = (route.query.order as string) || '';
  try {
    await widgetInstance.requestPayment({
      orderId,
      orderName: 'VBWD',
      successUrl: `${window.location.origin}/pay/toss/success`,
      failUrl: `${window.location.origin}/pay/toss/cancel`,
    });
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'payment failed';
  }
}

onMounted(loadWidget);
</script>

<style scoped>
.toss-payment { max-width: 640px; margin: 2rem auto; padding: 1rem; }
.toss-payment__pay { width: 100%; margin-top: 1rem; }
.toss-payment__error { color: var(--vbwd-color-danger, #b22); }
</style>
