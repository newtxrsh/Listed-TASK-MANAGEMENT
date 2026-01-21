export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Define auth routes
  const authRoutes = ['/auth/login', '/auth/register', '/auth/verify-email', '/auth/verification-success', '/auth/callback']
  const isAuthRoute = authRoutes.some(route => to.path.startsWith(route))

  const canVisitVerificationSuccessOnce = () => {
    if (!import.meta.client) return false
    const raw = sessionStorage.getItem('just_verified_at')
    if (!raw) return false
    const ts = Number(raw)
    if (!Number.isFinite(ts)) return false
    // allow only for 2 minutes after verification
    return Date.now() - ts <= 2 * 60 * 1000
  }

  // Wait for auth to initialize on client side
  if (import.meta.client && authStore.isLoading) {
    // Initialize auth if not already done
    await authStore.initializeAuth()
  }

  // If user is not authenticated and trying to access protected route
  if (!authStore.isAuthenticated && !isAuthRoute) {
    // Save the intended destination for redirect after login
    const redirect = to.fullPath !== '/' ? to.fullPath : undefined
    return navigateTo({
      path: '/auth/login',
      query: redirect ? { redirect } : undefined,
    })
  }

  // If user is authenticated, handle auth page access
  if (authStore.isAuthenticated && isAuthRoute) {
    const user = authStore.user
    const isVerified = user?.is_verified ?? false

    // If user is verified, redirect them away from all auth pages
    if (isVerified) {
      // Allow one-time visit to success page right after verification
      if (to.path === '/auth/verification-success' && canVisitVerificationSuccessOnce()) {
        return
      }

      // Otherwise, redirect verified users to tasks
      return navigateTo('/tasks')
    }

    // If user is NOT verified:
    // - Allow access to verify-email page
    // - Redirect away from login and verification-success
    if (!isVerified) {
      if (to.path === '/auth/login') {
        // Unverified users should go to verification page, not login
        return navigateTo('/auth/verify-email')
      }
      if (to.path === '/auth/verification-success') {
        // Unverified users shouldn't see success page
        return navigateTo('/auth/verify-email')
      }
      // Allow verify-email page access
    }
  }
})
