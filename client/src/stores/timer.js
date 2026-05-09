import { defineStore } from 'pinia'
import { addNewSolve } from '../js/controller.js'

let countdown

export const useTimerStore = defineStore('timer', {
  state: () => ({
    phase: 'idle', // idle | ready | inspection | running
    time: 0,
    startTime: 0,
    inspectionTime: 15,
    interval: null,
    scramble: '',
    falloIspezione: false
  }),

  actions: {
    setReady() {
      this.phase = 'ready'
    },

    startInspection() {
      this.phase = 'inspection'
      this.inspectionTime = 15
      this.falloIspezione = false

      countdown = setInterval(() => {
        this.inspectionTime--
        if (this.inspectionTime <= 0) {
          clearInterval(countdown)
          this.falloIspezione = true;
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
      }, 1)
    },

    stopTimer() {
      if (this.interval) 
      {
        clearInterval(this.interval)
        addNewSolve()
      }
      this.phase = 'idle'
      
    },

    reset() {
      this.time = 0
      this.phase = 'idle'
    }
  }
})