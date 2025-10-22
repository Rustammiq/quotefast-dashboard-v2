/* Complete AppProviders wrapper voor QuoteFast */

/* eslint-disable no-console */
'use client'

import React, { ReactNode, createContext, useState, useEffect } from 'react'
import { ThemeProvider as ThemeWrapper } from '@/contexts/ThemeContext'
import { AIPersonalizationProvider } from '@/contexts/AIPersonalizationContext'
import { Toaster } from 'react-hot-toast'

import { logger } from "@/lib/logger";
type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

// Auth context using real Supabase auth service
const AuthContext = createContext<{
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  updateProfile: (updates: { full_name?: string; email?: string }) => Promise<void>
}>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  updateProfile: async () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        // Use mock auth service for development
        const { mockAuthService } = await import('@/lib/mock-auth-service')
        const response = await mockAuthService.getCurrentUser()

        if (response.user) {
          setUser({
            id: response.user.id,
            email: response.user.email,
            full_name: response.user.name,
            avatar_url: null
          })
        }
      } catch (error) {
        logger.error('Auth initialization error:', 'auth', error)
        // Create test user for development
        await createTestUser()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Create a test user for development if needed
  const createTestUser = async () => {
    try {
      logger.info('🔧 Setting up test user for development...')
      const { mockAuthService } = await import('@/lib/mock-auth-service')

      // Try to login with test credentials first
      const testResponse = await mockAuthService.login('test@quotefast.nl', 'testpassword123')

      if (testResponse.user) {
        setUser({
          id: testResponse.user.id,
          email: testResponse.user.email,
          full_name: testResponse.user.name,
          avatar_url: null
        })
        logger.info('✅ Test user logged in successfully!')
      } else {
        logger.info('ℹ️ Test user not found, you may need to create it in Supabase')
      }
    } catch (error) {
      logger.info('ℹ️ Test user setup:', 'auth', error instanceof Error ? error.message : String(error))
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { mockAuthService } = await import('@/lib/mock-auth-service')
      const response = await mockAuthService.login(email, password)

      if (response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.name,
          avatar_url: null
        })
      } else {
        throw new Error(response.error || 'Inloggen mislukt')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Inloggen mislukt')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { mockAuthService } = await import('@/lib/mock-auth-service')
      await mockAuthService.logout()
      setUser(null)
    } catch (error: any) {
      logger.error('Sign out error:', error)
      throw new Error(error.message || 'Uitloggen mislukt')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const { mockAuthService } = await import('@/lib/mock-auth-service')
      const response = await mockAuthService.register(email, password, name)

      if (response.user && response.status === 200) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.name,
          avatar_url: null
        })
      } else if (response.status === 202) {
        // Email confirmation required
        throw new Error(response.error || 'Controleer je email om je account te bevestigen')
      } else {
        throw new Error(response.error || 'Registreren mislukt')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registreren mislukt')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: { full_name?: string; email?: string }) => {
    try {
      if (!user) throw new Error('Geen gebruiker ingelogd')

      setLoading(true)
      const { mockAuthService } = await import('@/lib/mock-auth-service')
      const response = await mockAuthService.updateUser(user.id, { name: updates.full_name })

      if (response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.name,
          avatar_url: null
        })
      } else {
        throw new Error(response.error || 'Profiel bijwerken mislukt')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Profiel bijwerken mislukt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// Export useAuth hook
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Standby context (simple implementation)
const StandbyContext = createContext({
  isStandby: false,
  setStandby: (standby: boolean) => {}
})

export const StandbyProvider = ({ children }: { children: ReactNode }) => {
  const [isStandby, setIsStandby] = useState(false)

  const setStandby = (standby: boolean) => {
    setIsStandby(standby)
  }

  return (
    <StandbyContext.Provider value={{ isStandby, setStandby }}>
      {children}
    </StandbyContext.Provider>
  )
}

// Main AppProviders component
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeWrapper>
      <AuthProvider>
        <AIPersonalizationProvider>
          <StandbyProvider>
            {children}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </StandbyProvider>
        </AIPersonalizationProvider>
      </AuthProvider>
    </ThemeWrapper>
  )
}

// Simple loading wrapper (without NProgress)
export function LoadingWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>
}
