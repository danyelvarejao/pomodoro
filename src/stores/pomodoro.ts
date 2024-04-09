import { addSeconds, differenceInSeconds } from 'date-fns'
import { defineStore } from 'pinia'

import { DEFAULT_MINUTES_BY_POMODORO_TYPE, useSettingsStore } from '@/stores/settings'

export enum TimerState {
  NOT_STARTED,
  STARTED,
  PAUSED
}

export enum PomodoroType {
  POMODORO = 'pomodoro',
  SHORT_BREAK = 'short break',
  LONG_BREAK = 'long break'
}

export interface PomodoroState {
  type: PomodoroType
  state: TimerState
  startedAt: Date | null
  pausedAt: Date | null
  totalSeconds: number
  amountSecondsPassed: number
}

export const usePomodoroStore = defineStore({
  id: 'pomodoro',

  state: (): PomodoroState => {
    return {
      type: PomodoroType.POMODORO,
      state: TimerState.NOT_STARTED,
      startedAt: null,
      pausedAt: null,
      totalSeconds: DEFAULT_MINUTES_BY_POMODORO_TYPE[PomodoroType.POMODORO] * 60,
      amountSecondsPassed: 0
    }
  },

  actions: {
    setType(type: PomodoroType) {
      this.type = type

      this.reset()
    },

    setState(state: TimerState) {
      this.state = state
    },

    setStartedAt(date: Date | null) {
      this.startedAt = date
    },

    setPausedAt(date: Date | null) {
      this.pausedAt = date
    },

    setTotalSeconds(seconds: number) {
      this.totalSeconds = seconds
    },

    setAmountSecondsPassed(seconds: number) {
      this.amountSecondsPassed = seconds
    },

    updateTotalSeconds() {
      const settingsStore = useSettingsStore()

      this.setTotalSeconds(settingsStore.minutesByPomodoroType[this.type] * 60)
    },

    reset() {
      this.setState(TimerState.NOT_STARTED)
      this.setStartedAt(null)
      this.setPausedAt(null)
      this.updateTotalSeconds()
      this.setAmountSecondsPassed(0)
    },

    start() {
      this.setStartedAt(new Date())
      this.setState(TimerState.STARTED)
    },

    resume() {
      if (!this.pausedAt || !this.startedAt) {
        return
      }

      const difference = differenceInSeconds(new Date(), this.pausedAt)
      const newStartedAt = addSeconds(this.startedAt, difference)

      this.setStartedAt(newStartedAt)
      this.setPausedAt(null)
      this.setState(TimerState.STARTED)
    },

    pause() {
      this.setPausedAt(new Date())
      this.setState(TimerState.PAUSED)
    },

    finish() {
      if (this.type === PomodoroType.POMODORO) {
        this.setType(PomodoroType.SHORT_BREAK)
      } else {
        this.setType(PomodoroType.POMODORO)
      }

      this.setState(TimerState.NOT_STARTED)
    },

    restart() {
      this.updateTotalSeconds()
      this.setAmountSecondsPassed(0)
      this.setStartedAt(new Date())
      this.setState(TimerState.STARTED)
    }
  },

  persist: {
    storage: sessionStorage
  }
})
