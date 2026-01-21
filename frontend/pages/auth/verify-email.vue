<template>
  <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-md shadow-lg px-8 py-8 md:px-10 md:py-10">
    <!-- Back Link -->
    <NuxtLink to="/auth/register" class="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white/80 transition-colors mb-6">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6"/>
      </svg>
      Back
    </NuxtLink>

    <!-- Header -->
    <div class="mb-6">
      <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-5">
        <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4V4z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M22 6l-10 7L2 6"/>
        </svg>
      </div>
      <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Verify Your Email</h1>
      <p class="mt-2 text-sm text-white/60">
        Enter the 6-digit code sent to your Gmail inbox
        <span v-if="maskedEmail" class="text-white/50">({{ maskedEmail }})</span>.
      </p>
    </div>

    <!-- Error Message -->
    <Transition name="fade-slide">
      <div 
        v-if="errorMessage" 
        class="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
      >
        <div class="flex items-start gap-3">
          <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <p class="text-sm text-red-200">{{ errorMessage }}</p>
        </div>
      </div>
    </Transition>

    <!-- Success Message -->
    <Transition name="fade-slide">
      <div 
        v-if="successMessage" 
        class="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
      >
        <div class="flex items-start gap-3">
          <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <p class="text-sm text-emerald-200">{{ successMessage }}</p>
        </div>
      </div>
    </Transition>

    <!-- OTP Form -->
    <form @submit.prevent="submitVerification" class="space-y-5">
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-white/90">Verification Code</label>
        <div class="grid grid-cols-6 gap-3">
          <input
            v-for="(digit, index) in digits"
            :key="index"
            :ref="el => inputRefs[index] = el as HTMLInputElement"
            v-model="digits[index]"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="1"
            class="h-14 w-full rounded-xl border border-white/10 bg-white/5 text-center text-lg font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            @input="onInput(index, $event)"
            @keydown="onKeydown(index, $event)"
            @paste="onPaste(index, $event)"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading || code.length !== 6"
        class="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg v-if="loading" class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ loading ? 'Verifying...' : 'Verify Email' }}</span>
      </button>
    </form>

    <!-- Resend Section -->
    <div class="mt-6 text-center text-sm text-white/50">
      Didn't receive the code?
    </div>

    <button
      type="button"
      class="mt-3 w-full h-11 rounded-xl border border-white/10 bg-white/5 text-blue-400 font-semibold hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
      :disabled="resendDisabled"
      @click="resendOtp"
    >
      <span v-if="!resendDisabled">Resend Code</span>
      <span v-else>Resend available in {{ resendCountdown }}s</span>
    </button>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Verify Your Email',
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

// LocalStorage key for registration data
const REGISTRATION_DATA_KEY = 'pending_registration'

// Form state
const digits = ref(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const maskedEmail = ref('')
const resendDisabled = ref(true)
const resendCountdown = ref(120)
let resendTimer: NodeJS.Timeout | null = null

// Store registration data from localStorage
const registrationData = ref<{
  firstName: string
  lastName: string
  email: string
  password: string
} | null>(null)

// Computed
const code = computed(() => digits.value.join(''))

// Methods
const maskEmail = (email: string) => {
  const [name, domain] = String(email).split('@')
  if (!domain) return ''
  const safeName = name.length <= 2
    ? (name[0] ?? '') + '*'
    : name[0] + '*'.repeat(Math.min(6, name.length - 2)) + name[name.length - 1]
  return `${safeName}@${domain}`
}

const focusIndex = (idx: number) => {
  nextTick(() => {
    const input = inputRefs.value[idx]
    if (input) {
      input.focus()
      input.select()
    }
  })
}

const onInput = (idx: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = (target.value || '').replace(/\D/g, '').slice(-1)
  digits.value[idx] = value

  if (value && idx < 5) {
    focusIndex(idx + 1)
  }
}

const onKeydown = (idx: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !digits.value[idx] && idx > 0) {
    focusIndex(idx - 1)
  }
  if (event.key === 'ArrowLeft' && idx > 0) {
    event.preventDefault()
    focusIndex(idx - 1)
  }
  if (event.key === 'ArrowRight' && idx < 5) {
    event.preventDefault()
    focusIndex(idx + 1)
  }
}

const onPaste = (idx: number, event: ClipboardEvent) => {
  const text = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (!text) return
  event.preventDefault()

  for (let i = 0; i < 6; i++) {
    digits.value[i] = text[i] || ''
  }
  const next = Math.min(5, text.length - 1)
  focusIndex(next)
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const submitVerification = async () => {
  if (loading.value) return
  clearMessages()

  if (code.value.length !== 6) {
    errorMessage.value = 'Please enter the 6-digit code.'
    return
  }

  if (!registrationData.value) {
    errorMessage.value = 'Registration data not found. Please go back and fill the form again.'
    return
  }

  loading.value = true

  try {
    // Verify OTP and create account in one call
    const result = await authStore.verifyAndCreateAccount(
      code.value,
      registrationData.value.email,
      registrationData.value.password,
      registrationData.value.firstName,
      registrationData.value.lastName
    )
    
    if (result.success) {
      successMessage.value = 'Email verified successfully! Creating your account...'
      setTimeout(() => {
        navigateTo('/auth/verification-success', { replace: true })
      }, 900)
    } else {
      if (result.code === 'OTP_EXPIRED') {
        stopResendCountdown()
        resendDisabled.value = false
      }
      errorMessage.value = result.error || 'Verification failed. Please try again.'
    }
  } catch (error) {
    errorMessage.value = 'Verification failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  clearMessages()
  resendDisabled.value = true

  if (!registrationData.value) {
    errorMessage.value = 'Registration data not found. Please go back and fill the form again.'
    resendDisabled.value = false
    return
  }

  try {
    const result = await authStore.resendRegistrationOtp(
      registrationData.value.email,
      registrationData.value.firstName,
      registrationData.value.lastName
    )
    
    if (result.success) {
      successMessage.value = result.message || 'A new code has been sent.'
      digits.value = ['', '', '', '', '', '']
      focusIndex(0)
      startResendCountdown(120)
    } else {
      if (result.retryAfterSeconds) {
        startResendCountdown(result.retryAfterSeconds)
        errorMessage.value = result.error || 'Please wait before resending.'
        return
      }
      resendDisabled.value = false
      errorMessage.value = result.error || 'Unable to resend code right now.'
    }
  } catch (error) {
    resendDisabled.value = false
    errorMessage.value = 'Unable to resend code right now.'
  }
}

const startResendCountdown = (seconds: number) => {
  stopResendCountdown()
  resendCountdown.value = Math.max(0, parseInt(String(seconds), 10) || 0)
  resendDisabled.value = resendCountdown.value > 0

  if (!resendDisabled.value) return

  resendTimer = setInterval(() => {
    resendCountdown.value = Math.max(0, resendCountdown.value - 1)
    if (resendCountdown.value <= 0) {
      stopResendCountdown()
      resendDisabled.value = false
    }
  }, 1000)
}

const stopResendCountdown = () => {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }
}

// Initialize
onMounted(async () => {
  // Load registration data from localStorage
  if (import.meta.client) {
    const storedData = localStorage.getItem(REGISTRATION_DATA_KEY)
    if (!storedData) {
      // No registration data, redirect back to register
      navigateTo('/auth/register')
      return
    }

    try {
      const data = JSON.parse(storedData)
      if (!data.email || !data.password) {
        // Invalid data, redirect back to register
        navigateTo('/auth/register')
        return
      }
      registrationData.value = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email,
        password: data.password,
      }
      maskedEmail.value = maskEmail(data.email)
    } catch (e) {
      console.error('Failed to parse stored registration data:', e)
      navigateTo('/auth/register')
      return
    }
  }

  // Start with a 2-minute resend cooldown (matches OTP TTL)
  startResendCountdown(120)
  focusIndex(0)
})

onUnmounted(() => {
  stopResendCountdown()
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
