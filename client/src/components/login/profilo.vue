<script setup>
import { ref, onMounted } from 'vue'
import ProfileField from '../utilities/ProfileField.vue'
import {changeAccount} from './../../js/controller.js'


const emit = defineEmits(['logout'])

const username = ref('')
const email = ref('')
const password = ref('')

const editingField = ref(null)
const originalValues = ref({})
const isLoading = ref(false)

const profileFields = {
  username,
  email,
  password
}

onMounted(() => {
  loadUserData()
})

// Carica i dati utente salvati dopo login/registrazione.
const loadUserData = () => {
  const utente = JSON.parse(sessionStorage.getItem('utente'))
  if (utente) {
    username.value = utente.username || ''
    email.value = utente.mail || ''
    password.value =  ''
  }
}

// Gestisce modifica, annullamento e salvataggio dei campi profilo.
const enableEdit = (field) => {
  originalValues.value[field] = profileFields[field].value
  editingField.value = field
}

const cancelEdit = (field) => {
  profileFields[field].value = originalValues.value[field]
  editingField.value = null
}

const saveEdit = async (field, newValue) => {
  isLoading.value = true

  try {
    await changeAccount(field, newValue)
  } catch (error) {
    console.error('Errore durante l\'aggiornamento:', error)
  } finally {
    isLoading.value = false
  }
  emit('logout')

}

const handleLogout = () => {
  const tipoCubo = sessionStorage.getItem('tipoCubo')

  sessionStorage.clear()

  if (tipoCubo) {
    sessionStorage.setItem('tipoCubo', tipoCubo)
  }

  window.dispatchEvent(new Event('solves-updated'))
  window.dispatchEvent(new Event('stats-updated'))
  emit('logout')
}
</script>

<template>
  <div class="profilo-container">
    <div class="profilo-card">
      <h1 class="profilo-title">Profilo</h1>
      
      <ProfileField
        label="Username"
        v-model="username"
        type="text"
        :isEditing="editingField === 'username'"
        :isLoading="isLoading"
        @edit="enableEdit('username')"
        @save="saveEdit('username', username)"
        @cancel="cancelEdit('username')"
      />

      <ProfileField
        label="Email"
        v-model="email"
        type="email"
        :isEditing="editingField === 'email'"
        :isLoading="isLoading"
        @edit="enableEdit('email')"
        @save="saveEdit('email', email)"
        @cancel="cancelEdit('email')"
      />

      <ProfileField
        label="Password"
        v-model="password"
        type="password"
        :isEditing="editingField === 'password'"
        :isLoading="isLoading"
        :isMasked="true"
        @edit="enableEdit('password')"
        @save="saveEdit('password', password)"
        @cancel="cancelEdit('password')"
      />

      <button
        @click="handleLogout"
        class="logout-btn"
        :disabled="isLoading"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
.profilo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  width: 100%;
}

.profilo-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 189, 126, 0.15);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  border: 2px solid rgba(0, 189, 126, 0.1);
}

.profilo-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(0, 189, 126);
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.logout-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, rgb(200, 0, 0), rgb(150, 0, 0));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.logout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(200, 0, 0, 0.3);
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (prefers-color-scheme: dark) {
  .profilo-card {
    background: linear-gradient(135deg, #222222 0%, #1a1a1a 100%);
    border-color: rgba(0, 189, 126, 0.15);
  }
}
</style>
