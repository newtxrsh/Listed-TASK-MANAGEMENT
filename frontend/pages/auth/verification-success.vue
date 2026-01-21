<template>
  <div class="relative z-10 w-full max-w-lg">
    <!-- Confetti Animation -->
    <div v-if="showConfetti" class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="confetti-container">
        <div 
          v-for="i in 50" 
          :key="i"
          class="confetti"
          :style="{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)]
          }"
        ></div>
      </div>
    </div>

    <!-- Card Container -->
    <div class="rounded-2xl border border-white/10 bg-white/5 px-8 py-8 text-center md:px-10 md:py-10">

      <!-- Animated Success Icon -->
      <div class="relative mx-auto mb-6 h-24 w-24">
        <div class="absolute inset-0 rounded-full bg-emerald-500/10"></div>
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30"></div>
        <div class="relative flex h-full w-full items-center justify-center">
          <svg class="checkmark-animate h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>

      <!-- Title & Copy -->
      <h1 class="mb-6 text-2xl font-semibold tracking-tight text-white md:text-3xl">Account Verified</h1>

      <!-- Status List -->
      <div class="mb-8 rounded-xl border border-white/10 bg-white/5 px-5 py-5 text-left">
        <div class="mb-3 flex items-center gap-2">
          <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-white">Ready to go!</p>
        </div>
        <p class="text-sm text-white/70">
          We’ll take you straight to your tasks so you can start organizing.
        </p>
      </div>

      <!-- Auto-redirect countdown -->
      <div class="mb-6 text-left">
        <p class="text-sm text-white/60 mb-3 font-semibold">
          Redirecting in 
          <span class="text-white/80 font-semibold">({{ countdown }}s)</span>
        </p>
        <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        @click="goToTasks"
        class="inline-flex items-center gap-2 rounded-3xl bg-blue-800/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-800/50 hover:shadow-lg"
      >
        <span class="text-lg text-bold">Go to Tasks</span>
        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Account Successfully Created!',
})

const route = useRoute()
const authStore = useAuthStore()

// State
const showConfetti = ref(true)
const confettiColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
let autoRedirectTimer: NodeJS.Timeout | null = null

const initialCountdown = 5
const countdown = ref(initialCountdown)
const progressPercent = ref(100)
let animationFrameId: number | null = null
let startTimeMs = 0

const startCountdownAnimation = () => {
  // reset state
  startTimeMs = Date.now()
  countdown.value = initialCountdown
  progressPercent.value = 100

  const durationMs = initialCountdown * 1000

  const tick = () => {
    const elapsed = Date.now() - startTimeMs
    const remaining = Math.max(0, durationMs - elapsed)

    // Smooth bar (updates ~60fps)
    progressPercent.value = (remaining / durationMs) * 100

    // Integer label (5,4,3,2,1,0)
    countdown.value = Math.ceil(remaining / 1000)

    if (remaining > 0) {
      animationFrameId = requestAnimationFrame(tick)
    } else {
      animationFrameId = null
    }
  }

  animationFrameId = requestAnimationFrame(tick)
}
// Get token from query params
const token = computed(() => route.query.token as string | undefined)

// Navigate to tasks and replace history to prevent back navigation
const goToTasks = () => {
  if (token.value) {
    authStore.setToken(token.value)
  }
  // Use replace: true to prevent back button from going to verification-success
  navigateTo('/tasks', { replace: true })
}

// Navigation guard: ensure user is authenticated and verified
onMounted(async () => {
  // Wait for auth to initialize
  if (authStore.isLoading) {
    await authStore.initializeAuth()
  }

  // Store token immediately if available
  if (token.value) {
    authStore.setToken(token.value)
    // Refresh user data after setting token
    await authStore.refreshUser()
  }

  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }

  // Refresh user to get latest verification status
  await authStore.refreshUser()
  const user = authStore.user
  const isVerified = user?.is_verified ?? false

  // If not verified, redirect to verification page
  if (!isVerified) {
    navigateTo('/auth/verify-email', { replace: true })
    return
  }

  // Consume the one-time access token so back button can't reopen this page later
  authStore.clearJustVerified()

  // Clear registration data from localStorage after successful verification
  localStorage.removeItem('pending_registration')

  // Auto-redirect verified users to tasks after a short delay (prevent staying on this page)
  startCountdownAnimation()

  autoRedirectTimer = setTimeout(() => {
    navigateTo('/tasks', { replace: true })
  }, 5000) // Redirect after 5 seconds

  // Hide confetti after 6 seconds
  setTimeout(() => {
    showConfetti.value = false
  }, 6000)
})

// Cleanup timer on unmount
onUnmounted(() => {
  if (autoRedirectTimer) {
    clearTimeout(autoRedirectTimer)
  }
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})

</script>

<style scoped>
.confetti-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti-fall 3s linear forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.checkmark-animate path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: checkmark-draw 0.5s ease-out 0.3s forwards;
}

@keyframes checkmark-draw {
  0% {
    stroke-dashoffset: 24;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
