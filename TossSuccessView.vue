<template>
  <div class="toss-success">
    <div v-if="confirming">
      {{ $t('toss.success.confirming') }}
    </div>
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>
    <div v-else>
      <h2>{{ $t('toss.success.title') }}</h2>
      <p>{{ $t('toss.success.message') }}</p>
      <router-link
        class="btn btn-primary"
        to="/dashboard"
      >
        {{ $t('toss.success.dashboard') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/api';

// Relative to the api client's `/api/v1` baseURL.
const API_PREFIX = '/plugins/toss-payments';

const route = useRoute();
const confirming = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const paymentKey = route.query.paymentKey as string;
  const orderId = route.query.orderId as string;
  const amount = route.query.amount;
  if (!paymentKey || !orderId || amount === undefined) {
    error.value = 'Missing confirmation params';
    confirming.value = false;
    return;
  }
  try {
    await api.post(`${API_PREFIX}/payments/confirm`, {
      paymentKey,
      orderId,
      amount: Number(amount),
    });
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'confirm failed';
  } finally {
    confirming.value = false;
  }
});
</script>

<style scoped>
.toss-success { max-width: 480px; margin: 4rem auto; text-align: center; }
.error { color: var(--vbwd-color-danger, #b22); }
</style>
