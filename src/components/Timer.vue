<template>
  <div class="timer-wrapper" @click="handleTimerAction">
    <div class="timer-container">
      <div
        class="progress-container"
        :style="{ '--progress': progressPercentage === 0 ? '100' : progressPercentage }"
      >
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
            <span v-if="pomodoroStore.state === TimerState.FINISHED">RESTART</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { differenceInSeconds } from 'date-fns'
import { computed, onMounted, onUnmounted } from 'vue'

import { TimerState, usePomodoroStore } from '@/stores/pomodoro'

const pomodoroStore = usePomodoroStore()

const remainingTime = computed(() => {
  const currentSeconds = pomodoroStore.totalSeconds - pomodoroStore.amountSecondsPassed

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  return {
    minutes: minutes,
    seconds: seconds
  }
})

// FIXME: Implement progress percentage
const progressPercentage = computed(() => {
  return 0
})

const handleTimerAction = () => {
  if (pomodoroStore.state === TimerState.NOT_STARTED) {
    pomodoroStore.start()
  } else if (pomodoroStore.state === TimerState.STARTED) {
    pomodoroStore.pause()
  } else if (pomodoroStore.state === TimerState.PAUSED) {
    pomodoroStore.resume()
  } else if (pomodoroStore.state === TimerState.FINISHED) {
    pomodoroStore.restart()
  }
}

let intervalId: number

onMounted(() => {
  intervalId = setInterval(() => {
    if (pomodoroStore.state === TimerState.STARTED) {
      pomodoroStore.setAmountSecondsPassed(
        differenceInSeconds(new Date(), pomodoroStore.startedAt || 0)
      )

      if (pomodoroStore.amountSecondsPassed >= pomodoroStore.totalSeconds) {
        pomodoroStore.finish()
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
  transition: 0.4s ease-out reverse;
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
