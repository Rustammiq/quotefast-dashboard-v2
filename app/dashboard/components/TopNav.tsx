"use client";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { Bell, Settings, User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { logger } from '@/lib/logger'

// Mock auth function for now (replace with real auth later)
const mockSignOut = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('auth_token')
}

export default function TopNav() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  

  // Navigation click handler
  const handleNavClick = (label: string) => {
    // Add analytics tracking here later
    logger.info(`Nav clicked: ${label}`, 'topnav')
  }

  // Sign out handler
  const handleSignOut = () => {
    try {
      mockSignOut()
      toast.success('Je bent succesvol uitgelogd')
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Er is een fout opgetreden bij het uitloggen')
    }
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Toggle user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  // Close menus on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsUserMenuOpen(false)
      setIsMobileMenuOpen(false)
    }

    // For Next.js App Router, we can use a simple effect
    const handleStart = () => {
      setIsUserMenuOpen(false)
      setIsMobileMenuOpen(false)
    }

    // Since we don't have router.events in App Router, use a simple timeout
    const timeoutId = setTimeout(handleStart, 100)
    return () => clearTimeout(timeoutId)
  }, [router])
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-black/80 backdrop-blur-sm border-b border-white/10 z-40 sticky top-0">
        <div className="container-app px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-xl font-bold text-white hover:scale-105 transition-transform"
              onClick={() => handleNavClick('logo')}
            >
              <span className="text-primary">Quote</span>
              <span className="text-purple-400">Fast</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center justify-center gap-8">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors px-3 py-2 rounded-md text-center"
                onClick={() => handleNavClick('dashboard')}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/offertes"
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors px-3 py-2 rounded-md text-center"
                onClick={() => handleNavClick('offertes')}
              >
                Offertes
              </Link>
              <Link
                href="/dashboard/klanten"
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors px-3 py-2 rounded-md text-center"
                onClick={() => handleNavClick('klanten')}
              >
                Klanten
              </Link>
              <Link
                href="/dashboard/team"
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors px-3 py-2 rounded-md text-center"
                onClick={() => handleNavClick('team')}
              >
                Team
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors px-3 py-2 rounded-md text-center"
                onClick={() => handleNavClick('settings')}
              >
                Settings
              </Link>
            </div>
        
            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
          {/* Notifications */}
              <button 
                className="relative p-2 text-white/70 hover:text-white rounded-lg transition-colors"
                onClick={() => {
                  logger.info('Notifications clicked', 'topnav')
                }}
                aria-label="Meldingen"
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">3 nieuwe meldingen</span>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive text-xs flex items-center justify-center rounded-full">
                  3
                </span>
              </button>

              {/* Theme Toggle */}
              <button 
                className="p-2 text-white/70 hover:text-white rounded-lg transition-colors"
                onClick={() => {
                  toggleTheme()
                  logger.info(`Theme toggled to: ${theme === 'dark' ? 'light' : 'dark'}`, 'topnav')
                }}
                aria-label="Thema wisselen"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  id="user-menu-button"
                  className="flex items-center gap-2 p-2 text-white/70 hover:text-white rounded-lg transition-colors"
                  onClick={toggleUserMenu}
                  aria-label="Gebruikersmenu"
                  aria-expanded={isUserMenuOpen ? "true" : "false"}
                  aria-haspopup="menu"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  <span className="sr-only">Gebruikersmenu</span>
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link 
                      href="/dashboard/profile" 
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 rounded"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        handleNavClick('profile')
                      }}
                    >
                      Mijn Profiel
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 rounded"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        handleNavClick('settings')
                      }}
                    >
                      Instellingen
                    </Link>
                    <div className="border-t border-white/10">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        Uitloggen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-black/80 backdrop-blur-sm border-b border-white/10 z-40 sticky top-0">
        <div className="container-app px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-xl font-bold text-white"
              onClick={() => handleNavClick('logo')}
            >
              <span className="text-primary">Quote</span>
              <span className="text-purple-400">Fast</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="p-2 text-white/70 hover:text-white rounded-lg transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Open mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-white/10 bg-black/90 backdrop-blur-sm">
              <div className="px-2 py-2 space-y-1 text-center">
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 w-full text-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleNavClick('dashboard')
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/offertes"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 w-full text-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleNavClick('offertes')
                  }}
                >
                  Offertes
                </Link>
                <Link
                  href="/dashboard/klanten"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 w-full text-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleNavClick('klanten')
                  }}
                >
                  Klanten
                </Link>
                <Link
                  href="/dashboard/team"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 w-full text-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleNavClick('team')
                  }}
                >
                  Team
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 w-full text-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleNavClick('settings')
                  }}
                >
                  Settings
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
