<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
        <svg class="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-white mb-2">Completing sign in...</h2>
      <p class="text-white/60 text-sm">Please wait while we complete your authentication.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const authStore = useAuthStore()
const { fetchCurrentUser } = useApi()

onMounted(async () => {
  const error = route.query.error as string

  if (error) {
    // Handle error from Google OAuth
    navigateTo({
      path: '/auth/login',
      query: { error: 'Google authentication failed. Please try again.' }
    })
    return
  }

  // Google OAuth now uses session-based authentication
  // The backend has already established a session, so we just need to verify it
  try {
    // Fetch user data using session cookie (sent automatically)
    const user = await fetchCurrentUser()
    
    if (user) {
      // Session is valid - set user and authenticated state
      authStore.setUser(user)
      authStore.setAuthenticated()
      
      // Redirect to tasks page
      navigateTo('/tasks')
    } else {
      // No user data - session might not be established
      console.error('Failed to fetch user data after Google OAuth')
      navigateTo({
        path: '/auth/login',
        query: { error: 'Authentication failed. Please try again.' }
      })
    }
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    
    // If 401, session is invalid/expired
    if (err?.response?.status === 401) {
      navigateTo({
        path: '/auth/login',
        query: { error: 'Session expired. Please try again.' }
      })
    } else {
      navigateTo({
        path: '/auth/login',
        query: { error: 'Authentication failed. Please try again.' }
      })
    }
  }
})
</script>
