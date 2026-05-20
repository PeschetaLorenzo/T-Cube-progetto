import { reactive } from 'vue'

export const inputState = reactive({
  visible: false,
  text: '',
  value: ''
})


export function showInput(text = '') {
  inputState.text = text
  inputState.value = ''
  inputState.visible = true
}

export function closeInputModal(){
  inputState.visible = false
  window.dispatchEvent(new CustomEvent('scramble-change', {detail: inputState.value}))
}