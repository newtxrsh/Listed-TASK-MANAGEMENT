<template>
  <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-md shadow-lg px-8 py-8 md:px-10 md:py-10">
    <!-- Logo / Heading -->
    <div class="mb-8">
      <div class="flex justify-start mb-5">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white">
          <!-- Same logo as sidebar -->
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
      <div class="text-left">
        <h1 class="text-2xl md:text-3xl font-semibold text-white tracking-tight">Create an account</h1>
        <p class="mt-2 text-sm text-white/60">Join Listed today to organize your tasks and projects.</p>
      </div>
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

    <!-- Register Form -->
    <form @submit.prevent="submitForm" class="space-y-5">
      <!-- First & Last Name Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg class="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <input 
              type="text" 
              id="firstName" 
              v-model="firstName"
              class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              placeholder="First name"
              required
            >
          </div>
        </div>

        <div class="space-y-2">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg class="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <input 
              type="text" 
              id="lastName" 
              v-model="lastName"
              class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              placeholder="Last name"
              required
            >
          </div>
        </div>
      </div>

      <!-- Email Field -->
      <div class="space-y-2">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg class="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <input 
            type="email" 
            id="email" 
            v-model="email"
            class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            placeholder="Email address"
            required
          >
        </div>
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg class="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            v-model="password"
            @input="checkPasswordStrength"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            placeholder="Password"
            required
            minlength="8"
          >
          
          <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg v-if="!showPassword" class="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else class="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
        </div>
        
        <!-- Password Strength Indicator -->
        <Transition name="fade">
          <div v-if="password.length > 0" class="space-y-2">
            <div class="flex gap-1">
              <div 
                v-for="i in 3" 
                :key="i"
                class="h-1 flex-1 rounded-full transition-all duration-300"
                :class="getStrengthBarClass(i)"
              ></div>
            </div>
            <p 
              class="text-xs"
              :class="strengthTextClass"
            >
              {{ passwordStrengthText }}
            </p>
          </div>
        </Transition>
      </div>

      <!-- Confirm Password Field -->
      <div class="space-y-2">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg class="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            id="confirmPassword" 
            v-model="confirmPassword"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            placeholder="Confirm password"
            required
          >
          <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg v-if="!showConfirmPassword" class="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else class="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
        </div>
        
        <!-- Password Match Indicator -->
        <Transition name="fade">
          <p 
            v-if="confirmPassword.length > 0" 
            class="flex items-center gap-1.5 text-xs"
            :class="passwordsMatch ? 'text-emerald-400' : 'text-red-400'"
          >
            <svg v-if="passwordsMatch" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            <span>{{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}</span>
          </p>
        </Transition>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        :disabled="loading || !passwordsMatch"
        class="flex w-full items-center justify-center gap-2 rounded-md bg-blue-800/30 px-4 py-3.5 text-xl font-bold text-white transition-all duration-300 hover:bg-blue-800/80 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <svg v-if="loading" class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ loading ? '' : 'Proceed' }}</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="my-8 flex items-center gap-4">
      <div class="h-px flex-1 bg-white/10"></div>
      <span class="text-xs font-medium uppercase tracking-wide text-white/40">Or continue with</span>
      <div class="h-px flex-1 bg-white/10"></div>
    </div>

    <!-- Google Sign In -->
    <a 
      :href="googleLoginUrl" 
      class="flex w-full items-center justify-center gap-3 rounded-md border-2 border-gray-200 bg-transparent px-4 py-3.5 text-md font-bold text-white-700 shadow-sm transition-all duration-300 ease-in-out hover:text-black hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>Continue with Google</span>
    </a>

    <!-- Login Link -->
    <p class="mt-6 text-center text-sm text-white/60">
      Already have an account?
      <NuxtLink to="/auth/login" class="font-medium text-blue-400 hover:text-blue-300">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Create an account',
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

// LocalStorage key for registration data
const REGISTRATION_DATA_KEY = 'pending_registration'

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(true)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const passwordStrength = ref(0)

// Countdown timer state for rate limiting
const countdownSeconds = ref(0)
let countdownTimer: NodeJS.Timeout | null = null

// Format seconds into "X minutes and Y seconds" format
const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return '0 seconds'
  
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  const parts: string[] = []
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`)
  }
  if (secs > 0) {
    parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`)
  }
  
  return parts.join(' and ')
}

// Computed countdown message
const countdownMessage = computed(() => {
  if (countdownSeconds.value > 0) {
    return `Please wait ${formatCountdown(countdownSeconds.value)} before requesting a new code.`
  }
  return ''
})

// Start countdown timer
const startCountdown = (seconds: number) => {
  stopCountdown()
  countdownSeconds.value = Math.max(0, Math.floor(seconds))
  
  if (countdownSeconds.value > 0) {
    countdownTimer = setInterval(() => {
      countdownSeconds.value = Math.max(0, countdownSeconds.value - 1)
      if (countdownSeconds.value <= 0) {
        stopCountdown()
        // Clear error message when countdown ends
        if (errorMessage.value.includes('Please wait')) {
          errorMessage.value = ''
        }
      }
    }, 1000)
  }
}

// Stop countdown timer
const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// Save registration data to localStorage in real-time
const saveRegistrationData = () => {
  if (import.meta.client) {
    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    }
    localStorage.setItem(REGISTRATION_DATA_KEY, JSON.stringify(data))
  }
}

// Load registration data from localStorage
const loadRegistrationData = () => {
  if (import.meta.client) {
    const storedData = localStorage.getItem(REGISTRATION_DATA_KEY)
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        firstName.value = data.firstName || ''
        lastName.value = data.lastName || ''
        email.value = data.email || ''
        password.value = data.password || ''
        confirmPassword.value = data.confirmPassword || ''
        // Recalculate password strength
        if (password.value) {
          checkPasswordStrength()
        }
      } catch (e) {
        console.error('Failed to parse stored registration data:', e)
      }
    }
  }
}

// Watch form fields and save to localStorage on change
watch([firstName, lastName, email, password, confirmPassword], () => {
  saveRegistrationData()
}, { deep: true })

// Navigation guard: redirect authenticated and verified users
onMounted(async () => {
  // Load saved registration data first
  loadRegistrationData()

  if (authStore.isLoading) {
    await authStore.initializeAuth()
  }

  if (authStore.isAuthenticated) {
    const user = authStore.user
    const isVerified = user?.is_verified ?? false
    
    if (isVerified) {
      // Already logged in and verified, redirect to main app
      navigateTo('/tasks')
    }
  }
})

// Computed properties
const passwordsMatch = computed(() => password.value === confirmPassword.value)

const passwordStrengthText = computed(() => {
  if (passwordStrength.value >= 3) return 'Strong password'
  if (passwordStrength.value >= 2) return 'Fair password'
  return 'Weak password'
})

const strengthTextClass = computed(() => {
  if (passwordStrength.value >= 3) return 'text-emerald-400'
  if (passwordStrength.value >= 2) return 'text-yellow-400'
  return 'text-red-400'
})

// Google login URL
const googleLoginUrl = computed(() => {
  const baseUrl = config.public.apiBase.replace('/api', '')
  return `${baseUrl}/auth/google`
})

// Methods
const getStrengthBarClass = (index: number) => {
  if (passwordStrength.value >= index) {
    if (passwordStrength.value >= 3) return 'bg-emerald-500'
    if (passwordStrength.value >= 2) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  return 'bg-white/10'
}

const checkPasswordStrength = () => {
  let strength = 0
  const pwd = password.value

  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++

  passwordStrength.value = strength
}

const submitForm = async () => {
  if (!passwordsMatch.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  // Don't submit if countdown is active
  if (countdownSeconds.value > 0) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Send OTP to email without creating account yet
    const result = await authStore.sendRegistrationOtp(email.value, firstName.value, lastName.value)
    
    if (result.success) {
      successMessage.value = 'Proceeding to email verification...'
      // Redirect to email verification page
      setTimeout(() => {
        navigateTo('/auth/verify-email')
      }, 1000)
    } else {
      // Check if there's a retry_after_seconds in the error response
      if (result.retryAfterSeconds && result.retryAfterSeconds > 0) {
        startCountdown(result.retryAfterSeconds)
        errorMessage.value = countdownMessage.value
      } else {
        errorMessage.value = result.error || 'Failed to send verification code. Please try again.'
      }
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Update error message when countdown changes
watch(countdownSeconds, () => {
  if (countdownSeconds.value > 0 && errorMessage.value.includes('Please wait')) {
    errorMessage.value = countdownMessage.value
  }
})

// Cleanup on unmount
onUnmounted(() => {
  stopCountdown()
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
