<template>
  <header>{{ APP_NAME.toLowerCase() }}</header>

  <nav>
    <div>
      <button
        v-for="(type, key) in PomodoroType"
        :key="key"
        @click="selectPomodoroType(type)"
        :class="{ active: pomodoroStore.type === type }"
      >
        {{ type }}
      </button>

      <span class="slider" ref="slider"></span>
    </div>
  </nav>

  <main>
    <Timer @on-finish="updateSliderPosition" />
  </main>

  <footer>
    <SettingsModal />
    <p>
      This website was made with 💖 by
      <a href="https://github.com/danyelvarejao" target="_blank">Danyel Varejão</a>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import SettingsModal from '@/components/SettingsModal.vue'
import Timer from '@/components/Timer.vue'
import { PomodoroType, usePomodoroStore } from '@/stores/pomodoro'
import { APP_NAME } from '@/utils/constants'

const pomodoroStore = usePomodoroStore()
const slider = ref<HTMLSpanElement | null>(null)

const selectPomodoroType = (type: PomodoroType) => {
  pomodoroStore.setType(type)

  updateSliderPosition()
}

const updateSliderPosition = (useTransition: boolean = true) => {
  const sliderElement = slider.value
  if (!sliderElement) {
    return
  }

  const navWidth = sliderElement.parentElement?.offsetWidth || 0
  const itemWidth = navWidth / Object.keys(PomodoroType).length
  const index = Object.values(PomodoroType).indexOf(pomodoroStore.type)
  const newPosition = index * itemWidth

  if (!useTransition) {
    sliderElement.style.transition = 'none'
  } else {
    sliderElement.style.transition = '0.25s ease'
  }
  sliderElement.style.width = `${itemWidth / 10}rem`
  sliderElement.style.transform = `translateX(${newPosition / 10}rem)`
}

onMounted(() => {
  updateSliderPosition(false)

  window.addEventListener('resize', () => updateSliderPosition(false))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => updateSliderPosition(false))
})
</script>

<style lang="scss" scoped>
header {
  font-weight: bold;
  font-size: 3.2rem;

  padding-block: 5rem;
  padding-inline: 1rem;
  text-align: center;
}

nav {
  background-color: var(--color-very-dark-blue);
  border-radius: 3.4rem;

  max-width: 48rem;
  width: 100%;

  padding: 0.8rem;

  margin: 0 auto;

  > div {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;

    border-radius: inherit;

    > button {
      background-color: transparent;
      border: none;

      flex: 1;

      height: 100%;

      padding-block: 1.6rem;

      color: var(--color-very-light-gray);
      font-weight: bold;
      font-family: inherit;
      word-break: break-word;

      z-index: 2;

      cursor: pointer;

      &:hover {
        color: var(--color-gray);
      }
    }

    .active {
      color: var(--color-dark-blue);
    }

    .slider {
      position: absolute;
      top: 0;
      left: 0;

      height: 100%;

      background-color: var(--app-color);
      border-radius: inherit;

      transition: 0.25s ease;
      transition-property: width, transform;
    }
  }
}

main {
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 7rem;
}

footer {
  padding: 6rem;

  > p {
    text-align: center;
    margin-top: 1.4rem;

    > a {
      text-decoration: none;
      color: var(--app-color);
    }
  }
}
</style>
