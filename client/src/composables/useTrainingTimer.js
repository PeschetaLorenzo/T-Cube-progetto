import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const HOLD_DELAY = 500

function isEditableTarget(target) {
    const tagName = target?.tagName?.toLowerCase()
    return ['input', 'textarea', 'select', 'button'].includes(tagName) || target?.isContentEditable
}

export function useTrainingTimer(options = {}) {
    const phase = ref('idle')
    const time = ref(0)

    let holdTimer = null
    let frame = null
    let startTime = 0

    const formattedTime = computed(() => {
        const seconds = (time.value / 1000).toFixed(3)
        const [integer, decimal] = seconds.split('.')

        return {
            integer,
            decimal,
            full: seconds
        }
    })

    function canUseTimer() {
        return options.enabled ? options.enabled() : true
    }

    function clearHold() {
        if (holdTimer) {
            clearTimeout(holdTimer)
            holdTimer = null
        }
    }

    function clearFrame() {
        if (frame) {
            cancelAnimationFrame(frame)
            frame = null
        }
    }

    function tick() {
        time.value = performance.now() - startTime
        frame = requestAnimationFrame(tick)
    }

    function setReady() {
        if (phase.value !== 'idle') {
            return
        }

        phase.value = 'ready'
    }

    function startTimer() {
        if (phase.value !== 'ready') {
            return
        }

        clearFrame()
        startTime = performance.now()
        time.value = 0
        phase.value = 'running'
        frame = requestAnimationFrame(tick)
    }

    function stopTimer() {
        if (phase.value !== 'running') {
            return
        }

        const finalTime = performance.now() - startTime
        clearFrame()
        time.value = finalTime
        phase.value = 'idle'
        options.onStop?.(finalTime)
    }

    function reset() {
        clearHold()
        clearFrame()
        phase.value = 'idle'
        time.value = 0
    }

    function onKeydown(event) {
        if (event.code !== 'Space' || event.repeat || isEditableTarget(event.target)) {
            return
        }

        if (!canUseTimer()) {
            return
        }

        event.preventDefault()

        if (phase.value === 'running') {
            stopTimer()
            return
        }

        if (phase.value !== 'idle') {
            return
        }

        clearHold()
        holdTimer = setTimeout(() => {
            if (canUseTimer()) {
                setReady()
            }
        }, HOLD_DELAY)
    }

    function onKeyup(event) {
        if (event.code !== 'Space' || isEditableTarget(event.target)) {
            return
        }

        if (!canUseTimer() && phase.value !== 'ready') {
            clearHold()
            return
        }

        event.preventDefault()
        clearHold()

        if (phase.value === 'ready') {
            startTimer()
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', onKeydown)
        document.addEventListener('keyup', onKeyup)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', onKeydown)
        document.removeEventListener('keyup', onKeyup)
        reset()
    })

    return {
        phase,
        time,
        formattedTime,
        reset,
        setReady,
        startTimer,
        stopTimer
    }
}
