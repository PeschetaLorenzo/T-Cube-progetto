import { defineStore } from 'pinia'

let countdown

export const useTimerStore = defineStore('timer', {
  state: () => ({
    phase: 'idle', // idle | ready | inspection | running
    time: 0,
    startTime: 0,
    inspectionTime: 15,
    interval: null
  }),

  actions: {
    setReady() {
      this.phase = 'ready'
    },

    startInspection() {
      this.phase = 'inspection'
      this.inspectionTime = 15

      countdown = setInterval(() => {
        this.inspectionTime--
        if (this.inspectionTime <= 0) {
          clearInterval(countdown)
          this.startTimer()
        }
      }, 1000)
    },

    startTimer() {
      this.phase = 'running'
      clearInterval(countdown)
      this.startTime = performance.now()

      this.interval = setInterval(() => {
        this.time = performance.now() - this.startTime
      }, 10)
    },

    stopTimer() {
      if (this.interval) 
        clearInterval(this.interval)
      
      this.phase = 'idle'
    },

    reset() {
      this.time = 0
      this.phase = 'idle'
    }
  }
})