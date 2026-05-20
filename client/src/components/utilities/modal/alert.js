import { reactive } from 'vue'

let hideTimer = null

export const alertState = reactive({
  visible: false,
  text: '',
  severity: 'info'
})

const severityMap = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'primary  '
}

export function showAlert(text, severity = 'info') {
  alertState.text = text
  alertState.severity = severityMap[severity] ?? 'info'
  alertState.visible = true

  if (hideTimer) {
    clearTimeout(hideTimer)
  }

  hideTimer = setTimeout(() => {
    alertState.visible = false
    hideTimer = null
  }, 5000)
}

