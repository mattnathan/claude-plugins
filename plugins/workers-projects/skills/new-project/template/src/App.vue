<script setup lang="ts">
import { onMounted, ref } from 'vue'

const message = ref('Loading…')

onMounted(async () => {
  const res = await fetch('/api/hello')
  const data = (await res.json()) as { message: string }
  message.value = data.message
})
</script>

<template>
  <main>
    <h1>__NAME__</h1>
    <p>{{ message }}</p>
  </main>
</template>
