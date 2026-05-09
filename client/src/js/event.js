import { useTimerStore } from '@/stores/timer'

let holdTimer = null
let longPress = false
const DELAY = 500

export function setupEvents() {
  const timer = useTimerStore()

  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space') return
    if (e.repeat) return

    longPress = false

    holdTimer = setTimeout(() => {
      longPress = true
      if(timer.phase === 'inspection')
        timer.setReady()
      //else 
        //timer.startInspection()
    }, DELAY)
  })

  document.addEventListener('keyup', (e) => {
    if (e.code !== 'Space') return

    clearTimeout(holdTimer)

    // SHORT PRESS
    if (!longPress) {
      if (timer.phase === 'idle') {
        timer.startInspection()
      } else if (timer.phase === 'running') {
        timer.stopTimer()
      }
      return
    }

    // LONG PRESS → rilascio = start
    if (longPress) {
      if (timer.phase === 'ready') {
        timer.startTimer()
      }
    }
  })
}