'use client'
import React, { useState } from 'react'
import { Mail, Lock, UserPlus, User, AlertCircle, Sparkles, Eye, EyeOff, ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../providers'
import { useRouter } from 'next/navigation'
import PublicNav from '../components/PublicNav'
import OnboardingWizard from './components/OnboardingWizard'
import { OnboardingData } from '../../lib/onboarding'
import { motion } from 'framer-motion'
import AnimatedCard from '../../components/ui/AnimatedCard'
import GradientText from '../../components/ui/GradientText'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import BrainNeuronAnimation from '../../components/ui/BrainNeuronAnimation'

// Force dynamic rendering for pages that use auth context
export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signUp(form.email, form.password, form.name)

      // Succes — toon onboarding
      setShowOnboarding(true)
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden bij het aanmaken van je account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data)
    setShowOnboarding(false)
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleOnboardingSkip = () => {
    setShowOnboarding(false)
    // Redirect to dashboard
    router.push('/dashboard')
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <PublicNav currentPage="register" />
        <div className="container-app py-24">
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <BrainNeuronAnimation />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <PublicNav currentPage="register" />
      <div className="container mx-auto px-6 py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md mx-auto"
        >
          {/* Enhanced Glass Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Animated Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-8 relative z-10"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
                <h1 className="text-4xl font-bold">
                  <GradientText>Account Aanmaken</GradientText>
                </h1>
              </div>
              <p className="text-gray-300 text-lg mb-6">Start je gratis proefperiode van 7 dagen</p>
              
              {/* Benefits List */}
              <div className="space-y-2 text-sm">
                {[
                  { icon: CheckCircle, text: "Geen creditcard nodig", color: "text-green-400" },
                  { icon: Zap, text: "Setup in 2 minuten", color: "text-yellow-400" },
                  { icon: Shield, text: "GDPR compliant", color: "text-blue-400" }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-center gap-2 text-white/70"
                  >
                    <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
                    <span>{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Enhanced Form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Name Field */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label htmlFor="name" className="block text-white font-medium mb-2 text-sm">
                  Volledige naam
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <motion.input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    whileFocus={{ scale: 1.02 }}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                  E-mailadres
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <motion.input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    whileFocus={{ scale: 1.02 }}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label htmlFor="password" className="block text-white font-medium mb-2 text-sm">
                  Wachtwoord
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <motion.input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Minimaal 8 karakters"
                    required
                    minLength={8}
                    whileFocus={{ scale: 1.02 }}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            form.password.length >= 8
                              ? i < 1 ? 'bg-green-400' : i < 2 ? 'bg-yellow-400' : 'bg-red-400'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {form.password.length < 8
                        ? 'Minimaal 8 karakters nodig'
                        : form.password.length < 12
                        ? 'Goed wachtwoord'
                        : 'Sterk wachtwoord'}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Enhanced Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      <span>Account aanmaken...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Account aanmaken</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Enhanced Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-8 text-center relative z-10"
            >
              <div className="text-gray-300 text-sm mb-4">
                Heb je al een account?{' '}
                <Link 
                  href="/login" 
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium inline-flex items-center gap-1 group"
                >
                  Inloggen
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="text-xs text-gray-400 leading-relaxed">
                Door een account aan te maken, ga je akkoord met onze{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Algemene Voorwaarden
                </Link>{' '}
                en{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacybeleid
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}