<script setup>
import { ref } from 'vue'
import FormInput from '../utilities/FormInput.vue'
import FormButton from '../utilities/FormButton.vue'
import FormAlert from '../utilities/FormAlert.vue'
import Profilo from './profilo.vue'

import {login, registrazione} from './../../js/controller.js'

const emit = defineEmits(['closeLogin'])

const username = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const page = ref('login')

const checkLoggato = () => {
  return sessionStorage.getItem('utente') != null
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const changePage = async () => {
    if(page.value == 'login')
        page.value = 'registrati'
    else
        page.value = 'login'
}

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Per favore, compila tutti i campi'
    return
  }

  if (!validateEmail(email.value)) {
    errorMessage.value = 'Email non valida'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La password deve avere almeno 6 caratteri'
    return
  }

  isLoading.value = true

  try {
    if(page.value == 'login')
      await login(email.value, password.value);
    else
      await registrazione(username.value, email.value, password.value);
    

    
      setTimeout(()=>{
        emit('closeLogin')
      }, 200)

  } catch (error) {
    errorMessage.value = 'Errore durante il login. Riprova.'
    isLoading.value = false
    return
  }
  
  username.value = JSON.parse(sessionStorage.getItem('utente')).username
  
  successMessage.value = `Benvenuto ${username.value}!`
  email.value = ''
  password.value = ''
  isLoading.value = false



}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}

</script>

<template>
  <div class="login-container" v-if="!checkLoggato()">
    <div class="login-card">
      <h1 class="login-title">T-CUBE</h1>
      <p class="login-subtitle">Accedi al tuo account</p>
      <form @submit.prevent="handleLogin" class="login-form">
         <FormInput v-if="page=='registrati'"
          id="username"
          label="Username"
          v-model="username"
          type="text"
          placeholder="Inserisci il tuo username"
          :disabled="isLoading"
          @keypress="handleKeyPress"
        />

        <FormInput
          id="email"
          label="Email"
          v-model="email"
          type="email"
          placeholder="Inserisci la tua email"
          :disabled="isLoading"
          @keypress="handleKeyPress"
        />

        <FormInput
          id="password"
          label="Password"
          v-model="password"
          type="password"
          placeholder="Inserisci la tua password"
          :disabled="isLoading"
          @keypress="handleKeyPress"
        />

        <FormAlert v-if="errorMessage" :message="errorMessage" type="error" />
        <FormAlert v-if="successMessage" :message="successMessage" type="success" />

        <FormButton
          type="submit"
          :disabled="isLoading"
          variant="primary"
        >
          {{ isLoading ? 'Accesso in corso...' : page == 'login' ? 'ACCEDI': 'REGISTRATI' }}
        </FormButton>
      </form>

      <div class="divider">oppure</div>

      <FormButton variant="secondary"
        type="submit"
        @click="changePage()">
            {{page == 'login' ? 'REGISTRATI' : 'Hai già un account? ACCEDI'}}
      </FormButton>
      <!-- TO DO
      <p class="login-footer" v-if="page == 'login'">
        <a @click="changePassword()" class="link">Password dimenticata?</a>
      </p>
      -->
    </div>
  </div>

  <Profilo v-if="checkLoggato()" @logout="emit('closeLogin')"></Profilo>
</template>

<style scoped>
.login-container { 
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    width: 100%;
    top: -50px;
    margin-top: 15rem;
}

.login-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 189, 126, 0.15);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  border: 2px solid rgba(0, 189, 126, 0.1);
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(0, 189, 126);
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.login-subtitle {
  text-align: center;
  color: rgba(24, 24, 24, 0.6);
  font-size: 1rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.divider {
  text-align: center;
  color: rgba(24, 24, 24, 0.4);
  font-size: 0.85rem;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: rgba(0, 189, 126, 0.2);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.link {
  color: rgb(0, 189, 126);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.link:hover {
  border-bottom-color: rgb(0, 189, 126);
  padding-bottom: 2px;
}

@media (prefers-color-scheme: dark) {
  .login-card {
    background: linear-gradient(135deg, #222222 0%, #1a1a1a 100%);
    border-color: rgba(0, 189, 126, 0.15);
  }

  .login-subtitle {
    color: rgba(235, 235, 235, 0.6);
  }

  .divider {
    color: rgba(235, 235, 235, 0.4);
  }

  .divider::before,
  .divider::after {
    background-color: rgba(0, 189, 126, 0.2);
  }

  .login-footer {
    color: rgba(235, 235, 235, 0.8);
  }
}
</style>

