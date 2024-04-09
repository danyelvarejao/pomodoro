<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger class="settings-button">
      <SettingsIcon />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="overlay" />
      <DialogContent class="content" as-child>
        <form @submit.prevent="handleApplySettings">
          <div class="header">
            <DialogTitle>Settings</DialogTitle>
            <VisuallyHidden>
              <DialogDescription>Settings modal</DialogDescription>
            </VisuallyHidden>
            <DialogClose aria-label="Close">
              <CloseIcon />
            </DialogClose>
          </div>

          <div class="time-settings">
            <h2>Time (minutes)</h2>

            <div class="pomodoro-types">
              <div v-for="(type, key) in PomodoroType" :key="key">
                <span>{{ type }}</span>
                <input type="number" v-model="form.minutesByPomodoroType[type]" required />
              </div>
            </div>
          </div>

          <div class="font-settings">
            <h2>Font</h2>

            <div class="font-types">
              <button
                v-for="(type, key) in FontsType"
                :key="key"
                @click="form.fontType = type"
                :class="{ active: form.fontType === type }"
                :style="{ fontFamily: type }"
                type="button"
              >
                Aa
              </button>
            </div>
          </div>

          <div class="color-settings">
            <h2>Color</h2>

            <div class="color-types">
              <button
                v-for="(type, key) in ColorsType"
                :key="key"
                @click="form.colorType = type"
                type="button"
                :style="{ backgroundColor: type }"
              >
                <CheckIcon v-if="form.colorType === type" />
              </button>
            </div>
          </div>

          <button type="submit">Apply</button>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden
} from 'radix-vue'
import { ref } from 'vue'

import CheckIcon from '@/components/icons/CheckIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import { PomodoroType, usePomodoroStore } from '@/stores/pomodoro'
import { ColorsType, FontsType, useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const pomodoroStore = usePomodoroStore()

const open = ref<boolean>(false)
const form = ref({
  minutesByPomodoroType: { ...settingsStore.minutesByPomodoroType },
  fontType: settingsStore.fontType,
  colorType: settingsStore.colorType
})

const handleApplySettings = () => {
  settingsStore.setMinutesByPomodoroType(form.value.minutesByPomodoroType)
  settingsStore.setFontType(form.value.fontType)
  settingsStore.setColorType(form.value.colorType)

  pomodoroStore.updateTotalSeconds()

  open.value = false
}
</script>

<style lang="scss" scoped>
.settings-button {
  display: block;

  margin: 0 auto;

  border: none;
  outline: none;
  background-color: transparent;
  color: var(--color-very-light-gray);

  cursor: pointer;

  &:hover {
    color: var(--color-gray);
  }
}

.overlay {
  position: fixed;
  inset: 0;

  background-color: rgba(0, 0, 0, 0.6);

  z-index: 100;
}

.content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: 54rem;
  width: 90vw;

  z-index: 101;

  background-color: var(--color-white);
  color: var(--color-very-dark-blue);
  border-radius: 2.5rem;

  > button {
    width: 14rem;
    height: 5.3rem;

    color: var(--color-white);
    font-size: 1.4rem;
    font-weight: bold;

    position: absolute;
    bottom: -2.5rem;
    right: 50%;
    transform: translateX(50%);

    border: none;
    outline: none;
    border-radius: 2.8rem;
    background-color: var(--app-color);

    cursor: pointer;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.6rem;

  padding: 3.4rem;

  border-bottom: 1px solid #e3e1e1;

  > h1 {
    font-size: 2.8rem;
    font-weight: bold;
  }

  > button {
    border: none;
    outline: none;
    background-color: transparent;
    color: var(--color-very-dark-blue);

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
  }
}

.time-settings {
  padding: 2.4rem;

  border-bottom: 1px solid #e3e1e1;

  > h2 {
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 0.4rem;
    text-transform: uppercase;
    text-align: center;

    margin-bottom: 1.8rem;

    @media (min-width: 640px) {
      text-align: initial;
    }
  }

  .pomodoro-types {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 0.8rem;

    > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.8rem;

      > span {
        flex: 1;

        font-size: 1.2rem;
        font-weight: bold;
        color: var(--color-very-light-gray);
      }

      > input {
        max-width: 14rem;
        width: 100%;

        background-color: var(--color-light-gray);
        border: 2px solid transparent;
        outline: none;
        border-radius: 1rem;

        padding: 1rem 0.5rem 1rem 1.6rem;

        &:focus {
          border: 2px solid var(--app-color);
        }
      }
    }

    @media (min-width: 640px) {
      flex-direction: row;
    }
  }
}

.font-settings {
  padding: 2.4rem;

  border-bottom: 1px solid #e3e1e1;

  > h2 {
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 0.4rem;
    text-transform: uppercase;
    text-align: center;

    margin-bottom: 1.8rem;
  }

  .font-types {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.6rem;

    > button {
      border: none;
      outline: none;
      background-color: var(--color-light-gray);
      border-radius: 50%;

      width: 4rem;
      height: 4rem;

      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 1.5rem;
      font-weight: bold;

      cursor: pointer;

      &:hover {
        background-color: var(--color-very-dark-blue);
        color: var(--color-white);
      }

      &.active {
        background-color: var(--color-very-dark-blue);
        color: var(--color-white);
      }
    }
  }

  @media (min-width: 640px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > h2 {
      margin-bottom: unset;
    }
  }
}

.color-settings {
  padding: 2.4rem;
  margin-bottom: 3.2rem;

  > h2 {
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 0.4rem;
    text-transform: uppercase;
    text-align: center;

    margin-bottom: 1.8rem;
  }

  .color-types {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.6rem;

    > button {
      border: none;
      outline: none;
      background-color: var(--color-light-gray);
      border-radius: 50%;

      width: 4rem;
      height: 4rem;

      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 1.5rem;
      font-weight: bold;

      cursor: pointer;
    }
  }

  @media (min-width: 640px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > h2 {
      margin-bottom: unset;
    }
  }
}
</style>
