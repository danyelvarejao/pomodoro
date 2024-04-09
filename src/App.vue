<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'

import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

watch(settingsStore, (newSettings) => {
  document.documentElement.style.setProperty('--app-font', `'${newSettings.fontType}', sans-serif`)
  document.documentElement.style.setProperty('--app-color', newSettings.colorType)
})

onMounted(() => {
  document.documentElement.style.setProperty(
    '--app-font',
    `'${settingsStore.fontType}', sans-serif`
  )
  document.documentElement.style.setProperty('--app-color', settingsStore.colorType)
})
</script>

<template>
  <RouterView />
</template>
