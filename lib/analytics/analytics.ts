/* eslint-disable no-console */
/* Simple Analytics setup voor QuoteFast */

import { useEffect } from 'react'

import { logger } from "@/lib/logger";
// Analytics configuration
const GA4_CONFIG = {
  measurementId: process.env.NEXT_PUBLIC_GA_ID,
  apiSecret: process.env.GA4_API_SECRET,
  debugMode: process.env.NODE_ENV === 'development'
}

// Initialize analytics (simplified)
let analyticsInstance: any = null

export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    // Simple analytics initialization without Firebase
    analyticsInstance = { initialized: true }
    return analyticsInstance
  }
  return null
}

// Page view tracking (simplified)
export const trackPageView = (pageTitle: string, pageLocation: string) => {
  if (analyticsInstance && typeof window !== 'undefined') {
    logger.info(`Page view tracked: ${pageTitle} at ${pageLocation}`)
  }
}

// Event tracking categories
export const events = {
  // CTA Tracking
  CTA_CLICK: {
    category: 'cta_click',
    action: 'button_click',
    label: 'cta_button',
    value: 0
  },
  
  // Form Submissions
  FORM_SUBMIT: {
    category: 'form_submission',
    action: 'form_submit',
    label: 'contact_form',
    value: 0
  },
  
  // User Authentication
  AUTH_SIGNUP: {
    category: 'user_auth',
    action: 'signup',
    label: 'user_registration',
    value: 10
  },
  
  AUTH_LOGIN: {
    category: 'user_auth',
    action: 'login',
    label: 'user_login',
    value: 5
  },
  
  // Offer Management
  OFFER_CREATED: {
    category: 'offer_management',
    action: 'offer_created',
    label: 'new_offer',
    value: 20
  },
  
  OFFER_SENT: {
    category: 'offer_management',
    action: 'offer_sent',
    label: 'offer_sent',
    value: 15
  },
  
  OFFER_ACCEPTED: {
    category: 'offer_management',
    action: 'offer_accepted',
    label: 'conversion',
    value: 100
  },
  
  // Invoice Management
  INVOICE_CREATED: {
    category: 'invoice_management',
    action: 'invoice_created',
    label: 'new_invoice',
    value: 25
  },
  
  INVOICE_PAID: {
    category: 'invoice_management',
    action: 'invoice_paid',
    label: 'payment_received',
    value: 50
  },
  
  // Team Management
  TEAM_MEMBER_INVITED: {
    category: 'team_management',
    action: 'member_invited',
    label: 'team_invite',
    value: 30
  },
  
  TEAM_MEMBER_JOINED: {
    category: 'team_management',
    action: 'member_joined',
    label: 'team_growth',
    value: 40
  },
  
  // User Engagement
  FEATURE_USED: {
    category: 'user_engagement',
    action: 'feature_used',
    label: 'ai_generator',
    value: 5
  },
  
  PAGE_VISITED: {
    category: 'page_view',
    action: 'page_visited',
    label: 'dashboard',
    value: 1
  }
}

// Track custom events (simplified)
export const trackEvent = (event: any, params: any = {}) => {
  if (analyticsInstance && typeof window !== 'undefined') {
    const eventData = {
      ...event,
      ...params,
      timestamp: new Date().toISOString(),
      user_id: getUserId(),
      session_id: getSessionId(),
      url: window.location.href,
      referrer: document.referrer || ''
    }
    
    logger.info('Event tracked:', eventData)
  }
}

// Get user ID for tracking (anonymous or authenticated)
const getUserId = () => {
  if (typeof window !== 'undefined') {
    // Check for authenticated user
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const parsed = JSON.parse(user)
        return parsed.id || 'anonymous_' + Date.now()
      } catch {
        return 'anonymous_' + Date.now()
      }
    }
    
    // Return anonymous ID
    return localStorage.getItem('ga_user_id') || 'anonymous_' + Date.now()
  }
  return 'server_side'
}

// Get session ID
const getSessionId = () => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('ga_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('ga_session_id', sessionId)
    }
    return sessionId
  }
  return 'server_session'
}

// E-commerce tracking for Stripe payments (simplified)
export const trackPurchase = (transaction: any) => {
  if (analyticsInstance && typeof window !== 'undefined') {
    logger.info(`Purchase tracked: ${transaction.id} - €${transaction.amount / 100}`)
  }
}

// A/B Testing tracking (simplified)
export const trackABTest = (experiment: string, variant: string) => {
  if (analyticsInstance && typeof window !== 'undefined') {
    logger.info(`AB test tracked: ${experiment} - ${variant}`)
  }
}

// User properties (simplified)
export const setUserProperties = (properties: any) => {
  if (analyticsInstance && typeof window !== 'undefined') {
    logger.info('User properties set:', properties)
  }
}

// Hook for React components
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize analytics on mount
    initializeAnalytics()
    
    // Track initial page view
    if (typeof window !== 'undefined') {
      trackPageView(
        document.title,
        window.location.pathname
      )
    }
  }, [])

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackABTest,
    setUserProperties
  }
}

// Server-side tracking (simplified)
export const trackServerEvent = async (event: any, params: any = {}) => {
  if (process.env.NODE_ENV === 'production') {
    logger.info(`Server event tracked: ${event} with params: ${JSON.stringify(params)}`)
    return { success: true }
  }
}

// Export analytics instance
export { analyticsInstance }
