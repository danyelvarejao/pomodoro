import { defineStore } from 'pinia'

import { PomodoroType } from '@/stores/pomodoro'

export const DEFAULT_MINUTES_BY_POMODORO_TYPE = {
  [PomodoroType.POMODORO]: 25,
  [PomodoroType.SHORT_BREAK]: 5,
  [PomodoroType.LONG_BREAK]: 15
}

export enum FontsType {
  KUMBH_SANS = 'Kumbh Sans',
  ROBOTO_SLAB = 'Roboto Slab',
  SPACE_MONO = 'Space Mono'
}

export enum ColorsType {
  RED = '#f87070',
  BLUE = '#70f3f8',
  PURPLE = '#d881f8'
}

export type MinutesByPomodoroType = Record<PomodoroType, number>

export interface SettingsState {
  fontType: FontsType
  colorType: ColorsType
  minutesByPomodoroType: MinutesByPomodoroType
}

export const useSettingsStore = defineStore({
  id: 'settings',

  state: (): SettingsState => ({
    fontType: FontsType.KUMBH_SANS,
    colorType: ColorsType.RED,
    minutesByPomodoroType: DEFAULT_MINUTES_BY_POMODORO_TYPE
  }),

  actions: {
    setFontType(fontType: FontsType) {
      this.fontType = fontType
    },

    setColorType(colorType: ColorsType) {
      this.colorType = colorType
    },

    setMinutesByPomodoroType(minutesByPomodoroType: MinutesByPomodoroType) {
      this.minutesByPomodoroType = minutesByPomodoroType
    }
  },

  persist: true
})
