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
      <h1 class="mb-2 text-2xl font-semibold tracking-tight text-white md:text-3xl mb-6">Account Verified</h1>

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

      <!-- Action Button -->
      <NuxtLink 
        to="/tasks"
        @click="storeToken"
        class="inline-flex items-center gap-2 rounded-3xl bg-blue-800/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-800/50 hover:shadow-lg"
      >
        <span class="text-lg text-bold">Go to Tasks</span>
        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </NuxtLink>
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

// Get token from query params
const token = computed(() => route.query.token as string | undefined)

// Store the token if available
const storeToken = () => {
  if (token.value) {
    authStore.setToken(token.value)
  }
}

onMounted(() => {
  // Store token immediately if available
  if (token.value) {
    authStore.setToken(token.value)
  }

  // Hide confetti after 4 seconds
  setTimeout(() => {
    showConfetti.value = false
  }, 4000)
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
