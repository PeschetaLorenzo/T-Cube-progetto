import { useTimerStore } from '@/stores/timer'

let holdTimer = null
let longPress = false
const DELAY = 500

export function setupEvents(canUseTimer = () => true) {
  const timer = useTimerStore()

  const onKeydown = (e) => {
    if (e.code !== 'Space') return
    if (e.repeat) return
    if (!canUseTimer()) return

    longPress = false

    holdTimer = setTimeout(() => {
      if (!canUseTimer()) return

      longPress = true
      if(timer.phase === 'inspection')
        timer.setReady()
      //else 
        //timer.startInspection()
    }, DELAY)
  }

  const onKeyup = (e) => {
    if (e.code !== 'Space') return
    if (!canUseTimer()) return

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
  }

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)

  return () => {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('keyup', onKeyup)
    clearTimeout(holdTimer)
  }
}
