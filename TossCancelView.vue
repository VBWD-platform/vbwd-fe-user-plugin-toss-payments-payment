<template>
  <div class="toss-cancel">
    <h2>{{ $t('toss.cancel.title') }}</h2>
    <p>{{ $t('toss.cancel.message') }}</p>
    <router-link class="btn btn-secondary" to="/checkout">
      {{ $t('toss.cancel.retry') }}
    </router-link>
  </div>
</template>

<style scoped>
.toss-cancel { max-width: 480px; margin: 4rem auto; text-align: center; }
</style>
