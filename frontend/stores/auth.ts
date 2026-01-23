import { defineStore } from 'pinia'

export interface User {
  id: number
  email: string
  fname?: string
  first_name?: string
  last_name?: string
  lname?: string
  profile_picture?: string | null
  email_verified_at?: string | null
  is_verified?: boolean
  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  lastActivity: number | null
  sessionTimeout: number // in milliseconds (24 hours = 86400000)
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    lastActivity: null,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours (matches backend session lifetime)
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userName: (state) => {
      if (state.user?.fname) return state.user.fname
      if (state.user?.email) return state.user.email.split('@')[0]
      return 'User'
    },
    userFullName: (state) => {
      if (state.user?.fname && state.user?.lname) {
        return `${state.user.fname} ${state.user.lname}`
      }
      return state.user?.fname || state.user?.email?.split('@')[0] || 'User'
    },
    userInitials: (state) => {
      if (state.user?.fname && state.user?.lname) {
        return `${state.user.fname[0]}${state.user.lname[0]}`.toUpperCase()
      }
      if (state.user?.fname) return state.user.fname[0].toUpperCase()
      if (state.user?.email) return state.user.email[0].toUpperCase()
      return 'U'
    },
    isEmailVerified: (state) => !!(state.user?.is_verified || state.user?.email_verified_at),
    isSessionExpired: (state) => {
      if (!state.lastActivity || !state.isAuthenticated) return false
      return Date.now() - state.lastActivity > state.sessionTimeout
    },
  },

  actions: {
    markJustVerified() {
      // One-time allowlist for visiting verification success page
      if (import.meta.client) {
        sessionStorage.setItem('just_verified_at', String(Date.now()))
      }
    },

    clearJustVerified() {
      if (import.meta.client) {
        sessionStorage.removeItem('just_verified_at')
      }
    },

    setAuthenticated() {
      this.isAuthenticated = true
      this.updateActivity()
    },

    setUser(user: User) {
      this.user = user
    },

    updateActivity() {
      this.lastActivity = Date.now()
      if (import.meta.client) {
        localStorage.setItem('last_activity', String(this.lastActivity))
      }
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      this.lastActivity = null
      if (import.meta.client) {
        localStorage.removeItem('last_activity')
      }
    },

    async initializeAuth() {
      this.isLoading = true
      
      if (import.meta.client) {
        const storedActivity = localStorage.getItem('last_activity')
        
        if (storedActivity) {
          this.lastActivity = parseInt(storedActivity, 10)
        }
        
        // Check if session has expired based on last activity
        if (this.lastActivity && Date.now() - this.lastActivity > this.sessionTimeout) {
          console.log('Session expired, clearing auth')
          this.clearAuth()
          this.isLoading = false
          return
        }
        
        // Verify session by fetching user data (session cookie will be sent automatically)
        try {
          const { fetchCurrentUser } = useApi()
          const user = await fetchCurrentUser()
          if (user) {
            this.user = user
            this.isAuthenticated = true
            this.updateActivity()
          } else {
            // Session is invalid, clear auth
            this.clearAuth()
          }
        } catch (error: any) {
          // If 401, session is invalid/expired
          if (error?.response?.status === 401) {
            console.log('Session invalid or expired')
            this.clearAuth()
          } else {
            console.error('Failed to verify session:', error)
          }
        }
      }
      
      this.isLoading = false
    },

    async updateProfile(data: Partial<User>) {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<User>(`${config.public.apiBase}/me`, {
          method: 'PUT',
          credentials: 'include',
          body: data,
        })
        
        this.user = { ...this.user, ...response }
        this.updateActivity()
        return { success: true }
      } catch (error: any) {
        const message = error?.data?.message || 'Failed to update profile'
        return { success: false, error: message }
      }
    },

    async refreshUser() {
      if (!this.isAuthenticated) return
      
      try {
        const { fetchCurrentUser } = useApi()
        const user = await fetchCurrentUser()
        if (user) {
          this.user = user
          this.updateActivity()
        }
      } catch (error) {
        console.error('Failed to refresh user:', error)
      }
    },

    async login(email: string, password: string) {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<{ message?: string; user?: User }>(`${config.public.apiBase}/login`, {
          method: 'POST',
          credentials: 'include', // Include cookies for session-based auth
          body: { email, password },
        })

        // Session cookie is set automatically by the server
        this.setAuthenticated()
        
        if (response.user) {
          this.setUser(response.user)
        } else {
          // Fetch user data if not returned with login
          const { fetchCurrentUser } = useApi()
          const user = await fetchCurrentUser()
          if (user) this.setUser(user)
        }

        return { success: true }
      } catch (error: any) {
        // Handle validation errors (422) and other errors
        // Nuxt's $fetch structures errors differently - check multiple possible locations
        let message = 'Login failed. Please try again.'
        
        if (error?.data?.message) {
          message = error.data.message
        } else if (error?.data?.errors?.email?.[0]) {
          message = error.data.errors.email[0]
        } else if (error?.response?._data?.message) {
          message = error.response._data.message
        } else if (error?.response?._data?.errors?.email?.[0]) {
          message = error.response._data.errors.email[0]
        } else if (error?.message) {
          message = error.message
        }
        
        console.error('Login error:', error)
        return { success: false, error: message }
      }
    },

    async register(email: string, password: string, firstName: string, lastName: string) {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<{ message?: string }>(`${config.public.apiBase}/register`, {
          method: 'POST',
          credentials: 'include',
          body: { email, password, first_name: firstName, last_name: lastName },
        })

        // Note: Registration may create a session, but user needs to verify email first
        // Session will be established after email verification

        return { success: true }
      } catch (error: any) {
        const message = error?.data?.message || 'Registration failed. Please try again.'
        return { success: false, error: message }
      }
    },

    async logout() {
      const config = useRuntimeConfig()
      
      try {
        await $fetch(`${config.public.apiBase}/logout`, {
          method: 'POST',
          credentials: 'include', // Include session cookie
        })
      } catch (error) {
        console.error('Logout API call failed:', error)
      } finally {
        this.clearAuth()
        navigateTo('/auth/login')
      }
    },

    async verifyEmailOtp(code: string) {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<{ message: string; redirect_url?: string }>(`${config.public.apiBase}/email/verify-otp`, {
          method: 'POST',
          credentials: 'include',
          body: { code },
        })

        // Refresh user data after verification
        await this.refreshUser()

        // If the user is now verified, allow the success page once
        if (this.user?.is_verified) {
          this.markJustVerified()
        }

        return { success: true, message: response.message, redirectUrl: response.redirect_url }
      } catch (error: any) {
        const message = error?.data?.message || 'Verification failed. Please try again.'
        const code = error?.data?.code
        return { success: false, error: message, code }
      }
    },

    async resendEmailOtp() {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<{ message: string; expires_in_seconds?: number }>(`${config.public.apiBase}/email/resend-otp`, {
          method: 'POST',
          credentials: 'include',
        })

        return { 
          success: true, 
          message: response.message,
          expiresInSeconds: response.expires_in_seconds 
        }
      } catch (error: any) {
        const message = error?.data?.message || 'Unable to resend code right now.'
        const retryAfterSeconds = error?.data?.retry_after_seconds
        return { success: false, error: message, retryAfterSeconds }
      }
    },

    // New method: Send OTP for registration without creating account
    async sendRegistrationOtp(email: string, firstName: string, lastName: string) {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<{ message: string }>(`${config.public.apiBase}/send-registration-otp`, {
          method: 'POST',
          body: { email, first_name: firstName, last_name: lastName },
        })

        return { success: true, message: response.message }
      } catch (error: any) {
        const message = error?.data?.message || 'Failed to send verification code. Please try again.'
        const retryAfterSeconds = error?.data?.retry_after_seconds
        return { success: false, error: message, retryAfterSeconds }
      }
    },

    // New method: Resend OTP for registration (no auth required)
    async resendRegistrationOtp(email: string, firstName: string, lastName: string) {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<{ message: string; expires_in_seconds?: number }>(`${config.public.apiBase}/resend-registration-otp`, {
          method: 'POST',
          body: { email, first_name: firstName, last_name: lastName },
        })

        return { 
          success: true, 
          message: response.message,
          expiresInSeconds: response.expires_in_seconds 
        }
      } catch (error: any) {
        const message = error?.data?.message || 'Unable to resend code right now.'
        const retryAfterSeconds = error?.data?.retry_after_seconds
        return { success: false, error: message, retryAfterSeconds }
      }
    },

    // New method: Verify OTP and create account
    async verifyAndCreateAccount(code: string, email: string, password: string, firstName: string, lastName: string) {
      const config = useRuntimeConfig()
      
      try {
        const response = await $fetch<{ message: string; user?: any }>(`${config.public.apiBase}/verify-and-register`, {
          method: 'POST',
          credentials: 'include',
          body: { code, email, password, first_name: firstName, last_name: lastName },
        })

        // Session cookie is set automatically by the server after registration
        this.setAuthenticated()

        if (response.user) {
          this.setUser(response.user)
        } else {
          // Fetch user data if not returned
          await this.refreshUser()
        }

        // Mark as just verified for success page access
        if (this.user?.is_verified) {
          this.markJustVerified()
        }

        return { success: true, message: response.message }
      } catch (error: any) {
        const message = error?.data?.message || 'Verification failed. Please try again.'
        const code = error?.data?.code
        return { success: false, error: message, code }
      }
    },
  },
})
