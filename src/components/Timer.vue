<template>
  <div class="timer-wrapper" @click="handleTimerAction">
    <div class="timer-container">
      <div class="progress-container" :style="{ '--progress': progressPercentage }">
        <div class="content">
          <div class="time">
            <span>{{ remainingTime.minutes[0] }}</span>
            <span>{{ remainingTime.minutes[1] }}</span>
            <span>:</span>
            <span>{{ remainingTime.seconds[0] }}</span>
            <span>{{ remainingTime.seconds[1] }}</span>
          </div>

          <div class="action">
            <span v-if="pomodoroStore.state === TimerState.NOT_STARTED">START</span>
            <span v-if="pomodoroStore.state === TimerState.STARTED">PAUSE</span>
            <span v-if="pomodoroStore.state === TimerState.PAUSED">RESUME</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['onFinish'])

import { differenceInSeconds } from 'date-fns'
import { computed, onMounted, onUnmounted, watch } from 'vue'

import { TimerState, usePomodoroStore } from '@/stores/pomodoro'
import { APP_NAME, AUDIOS_VOLUME } from '@/utils/constants'

const buttonPressAudio = new Audio('sounds/button-press.wav')
const alarmAudio = new Audio('sounds/alarm.mp3')

buttonPressAudio.volume = alarmAudio.volume = AUDIOS_VOLUME

const pomodoroStore = usePomodoroStore()

const remainingTime = computed(() => {
  const currentSeconds = Math.max(0, pomodoroStore.totalSeconds - pomodoroStore.amountSecondsPassed)

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  return {
    minutes: minutes,
    seconds: seconds
  }
})

watch(
  () => remainingTime.value,
  () => {
    document.title = `${remainingTime.value.minutes}:${remainingTime.value.seconds} - ${APP_NAME}`
  }
)

const progressPercentage = computed(() => {
  if (pomodoroStore.state === TimerState.NOT_STARTED) {
    return 100
  }

  return (pomodoroStore.amountSecondsPassed / pomodoroStore.totalSeconds) * 100
})

const handleTimerAction = () => {
  if (pomodoroStore.state === TimerState.NOT_STARTED) {
    pomodoroStore.start()
  } else if (pomodoroStore.state === TimerState.STARTED) {
    pomodoroStore.pause()
  } else if (pomodoroStore.state === TimerState.PAUSED) {
    pomodoroStore.resume()
  }

  buttonPressAudio.play()
}

let intervalId: number

onMounted(() => {
  intervalId = setInterval(() => {
    if (pomodoroStore.state === TimerState.STARTED) {
      pomodoroStore.setAmountSecondsPassed(
        differenceInSeconds(new Date(), pomodoroStore.startedAt || 0)
      )

      if (pomodoroStore.amountSecondsPassed > pomodoroStore.totalSeconds) {
        pomodoroStore.finish()
        alarmAudio.play()
        emit('onFinish')
      }
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style lang="scss" scoped>
.timer-wrapper {
  max-width: 21rem;
  width: 100%;
  height: 21rem;

  padding: 2.4rem;

  background: linear-gradient(to top left, #2e325a, #0e112a);
  border-radius: 50%;
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);

  position: relative;

  cursor: pointer;

  &:hover .action {
    color: var(--app-color);
  }

  @media (min-width: 310px) {
    max-width: 30rem;
    height: 30rem;
  }

  @media (min-width: 640px) {
    max-width: 41rem;
    height: 41rem;
  }
}

.timer-container {
  width: 100%;
  height: 100%;

  background-color: var(--color-very-dark-blue);
  border-radius: inherit;
  box-shadow:
    -5rem -5rem 10rem #272c5a,
    5rem 5rem 10rem #121530;

  padding: 1.4rem;
}

.progress-container {
  width: 100%;
  height: 100%;

  background: conic-gradient(var(--app-color) calc(var(--progress) * 1%), transparent 0deg);
  transition: background 0.4s ease-out; /* Removed 'reverse' */
  transition-property: background, color, width;

  border-radius: inherit;

  padding: 1.4rem;
}

.content {
  width: 100%;
  height: 100%;

  background-color: var(--color-very-dark-blue);
  border-radius: inherit;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  user-select: none;

  @media (min-width: 640px) {
    gap: 2rem;
  }
}

.time {
  font-size: 3rem;
  font-weight: bold;

  @media (min-width: 310px) {
    font-size: 6rem;
  }

  @media (min-width: 640px) {
    font-size: 9rem;
  }
}

.action {
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.5rem;

  @media (min-width: 310px) {
    font-size: 1.6rem;
  }

  @media (min-width: 640px) {
    letter-spacing: 1.5rem;
  }
}
</style>
