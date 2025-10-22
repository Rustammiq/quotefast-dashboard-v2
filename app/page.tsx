'use client'

import Link from 'next/link'
import { useTheme  } from '../contexts/ThemeContext'
import { Sun, Moon, Play, ArrowRight, CheckCircle, Shield, Users, Zap, Code, Rocket, Heart, Search, Bell, Settings, ArrowUp, ArrowDown, Folder, DollarSign, TrendingUp, Clock, FileText, Sparkles, Star } from 'lucide-react'
import PublicFooter from '@/app/components/PublicFooter'
import PricingSection from '@/app/components/PricingSection'
import GradientText from '@/components/ui/GradientText'
import FloatingElements from '@/components/ui/FloatingElements'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { memo, useMemo } from 'react'

// Memoized components for better performance
const FeatureCard = memo(({ icon: Icon, title, description, delay = 0 }: { 
  icon: React.ComponentType<any>, 
  title: string, 
  description: string, 
  delay?: number 
}) => {
  return (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="glass-card p-8 rounded-2xl border-border hover:shadow-lg"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
  >
    <motion.div 
      whileHover={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 0.3 }}
      className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mb-4 mx-auto"
    >
      <Icon className="w-6 h-6 text-primary" />
    </motion.div>
    <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">
      {description}
    </p>
  </motion.div>
  )
})

FeatureCard.displayName = 'FeatureCard'

const DashboardCard = memo(({
  title,
  value,
  growth,
  icon,
  progress,
  trend = "up",
  delay = 0,
  description,
  isLoading = false
}: {
  title: string;
  value: string | number;
  growth?: string;
  icon?: React.ReactNode;
  progress?: number;
  trend?: "up" | "down" | "neutral";
  delay?: number;
  description?: string;
  isLoading?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass-card p-6 rounded-xl border-border hover:shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
        <div className="w-8 h-8 glass-card rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
      {growth && (
        <div className="flex items-center gap-2 mb-3">
          <div className={`modern-glass-button px-2 py-1 text-xs ${trend === 'up' ? '' : 'bg-destructive/10 text-destructive'}`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {growth}
          </div>
        </div>
      )}
      {progress && (
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <motion.div
            className="h-2 bg-primary-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, delay }}
          />
        </div>
      )}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{progress}%</span>
        <span>Last updated: Just now</span>
      </div>
    </motion.div>
  )
})

DashboardCard.displayName = 'DashboardCard'

export default function Home() {
  const { theme, toggleTheme } = useTheme()

  // Memoized data for better performance
  const features = useMemo(() => [
    {
      icon: Zap,
      title: "AI Offertegenerator",
      description: "Laat AI automatisch professionele offertes genereren. Slimme productherkenning en automatische prijsberekening."
    },
    {
      icon: Users,
      title: "CRM & Klantbeheer",
      description: "Beheer al je klanten, leads en contacten op één plek. Track conversaties en follow-ups voor betere klantrelaties."
    },
    {
      icon: Shield,
      title: "Facturatie & Betalingen",
      description: "Automatische facturatie, betalingsherinneringen en Stripe integratie. Accepteer betalingen online."
    },
    {
      icon: Rocket,
      title: "Workflow Automatisering",
      description: "Automatiseer repetitieve taken. Van lead capture tot factuur verzending - alles draait automatisch."
    }
  ], [])

  const dashboardCards = useMemo(() => [
    { title: "Executions", value: "340", change: "204%", changeType: "positive", progress: 75, icon: Zap, delay: 0 },
    { title: "Projects", value: "12", change: "18%", changeType: "positive", progress: 60, icon: Folder, delay: 0.2 },
    { title: "Team Reviews", value: "5", change: "-12%", changeType: "negative", progress: 40, icon: Users, delay: 0.4 },
    { title: "Active Users", value: "1.284", change: "8%", changeType: "positive", progress: 82, icon: Users, delay: 0.6 },
    { title: "Revenue", value: "$45.2K", change: "32%", changeType: "positive", progress: 91, icon: DollarSign, delay: 0.8 },
    { title: "Conversion", value: "3.2%", change: "-5%", changeType: "negative", progress: 28, icon: TrendingUp, delay: 1.0 },
    { title: "Avg. Response", value: "1.2s", change: "15%", changeType: "positive", progress: 67, icon: Clock, delay: 1.2 },
    { title: "Offers Generated", value: "127", change: "24%", changeType: "positive", progress: 76, icon: FileText, delay: 1.4 }
  ], [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-950/30 to-background relative overflow-hidden">
      <ScrollProgress />
      <FloatingElements />
      
      {/* Navigation - Glass styled */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container-app py-6 flex items-center justify-between relative z-10"
      >
        <Link href="/" className="font-bold text-xl text-white flex items-center gap-2 hover:scale-105 transition-transform">
          <Sparkles className="w-6 h-6 text-primary" />
          QuoteFast
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-white/80">
            <Button href="/features" variant="underline" size="sm">Features</Button>
            <Button href="/pricing" variant="underline" size="sm">Pricing</Button>
            <Button href="/login" variant="underline" size="sm">Login</Button>
          </div>
          
          {/* Theme Toggle - Glass styled */}
          <Button
            variant="glass"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full !border-primary"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4" />
                <span className="text-sm">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span className="text-sm">Dark</span>
              </>
            )}
          </Button>
          
          <Button href="/register" variant="glass" size="default">
            <Star className="w-4 h-4" />
            Start Gratis
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section - Enhanced with Glass Buttons */}
      <section className="container-app py-24 relative z-10">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">AI-Powered Quote Generation</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-white">
            <GradientText className="text-5xl md:text-6xl font-bold">
              QuoteFast Dashboard.
            </GradientText>
            <br />
            <span className="text-muted-foreground">Automatiseer je offertes met AI en groei je bedrijf sneller.</span>
          </h1>
        </motion.div>

        {/* CTA Buttons - Glass styled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
        >
          <Button href="/register" variant="premium" size="lg" className="shadow-lg">
            <Sparkles className="w-5 h-5" />
            Start Gratis Proberen
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button href="/features" variant="glass" size="lg">
            <Play className="w-5 h-5" />
            Bekijk Demo
          </Button>
        </motion.div>
      </section>

      {/* Dashboard Preview - Glass styled buttons */}
      <div className="mt-16 relative">
        <div className="relative max-w-6xl mx-auto">
          {/* macOS Window Frame */}
          <div className="glass-card-premium rounded-t-xl overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <div className="text-foreground/80 text-sm font-mono">QuoteFast Dashboard</div>
              <div className="w-6"></div>
            </div>
          </div>
          
          {/* Dashboard Content - Glass styled */}
          <div className="glass-card rounded-b-xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search anything..." 
                      className="glass-card px-4 py-2 rounded-lg border-border text-foreground/80 placeholder-muted-foreground w-64"
                    />
                    <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <Button variant="glass" size="icon" className="!p-2 !rounded-lg">
                    <Bell className="w-5 h-5 text-foreground/70" />
                  </Button>
                  <Button variant="glass" size="icon" className="!p-2 !rounded-lg">
                    <Settings className="w-5 h-5 text-foreground/70" />
                  </Button>
                  <div className="relative group">
                    <div className="w-8 h-8 glass-card rounded-full flex items-center justify-center text-foreground font-semibold text-sm">
                      U
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Banner - Glass styled */}
            <div className="glass-card mx-6 mt-6 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Try the Advanced Layout</h3>
                  <p className="text-muted-foreground">Experience custom cursors, 3D backgrounds, and glassmorphism effects.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="glass" size="sm">
                    <Zap className="w-4 h-4" />
                    View Demo
                  </Button>
                  <Button variant="glass" size="sm" className="text-foreground/80 hover:text-foreground">
                    Examples
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Cards Grid - Glass styled */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Card 1 - Executions */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Executions</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <Zap className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">340</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs">
                      <ArrowUp className="w-3 h-3" />
                      204%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-accent-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>75%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>

                {/* Card 2 - Projects */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Projects</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <Folder className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">12</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs">
                      <ArrowUp className="w-3 h-3" />
                      18%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-accent-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>60%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>

                {/* Card 3 - Team Reviews */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Team Reviews</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <Users className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">5</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs bg-destructive/10 text-destructive">
                      <ArrowDown className="w-3 h-3" />
                      -12%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-destructive-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '40%' }}
                      transition={{ duration: 1.5, delay: 0.4 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>40%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>

                {/* Card 4 - Active Users */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Active Users</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <Users className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">1.284</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs">
                      <ArrowUp className="w-3 h-3" />
                      8%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-success-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 1.5, delay: 0.6 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>82%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 5 - Revenue */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Revenue</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">$45.2K</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs">
                      <ArrowUp className="w-3 h-3" />
                      32%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-success-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '91%' }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>91%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>

                {/* Card 6 - Conversion */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Conversion</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">3.2%</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs bg-destructive/10 text-destructive">
                      <ArrowDown className="w-3 h-3" />
                      -5%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-warning-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '28%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>28%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>

                {/* Card 7 - Avg Response */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Avg. Response</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <Clock className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">1.2s</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs">
                      <ArrowUp className="w-3 h-3" />
                      15%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-success-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '67%' }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>67%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>

                {/* Card 8 - Offers Generated */}
                <div className="glass-card p-6 rounded-xl border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground/80">Offers Generated</h3>
                    <Button variant="glass" size="icon" className="!w-auto !h-auto p-1 hover:bg-accent rounded !border-none">
                      <FileText className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">127</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="modern-glass-button px-2 py-1 text-xs">
                      <ArrowUp className="w-3 h-3" />
                      24%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-2 bg-primary-gradient rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '76%' }}
                      transition={{ duration: 1.5, delay: 1.4 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>76%</span>
                    <span>Last updated: Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid - Glass styled interactions */}
      <section className="container-app py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            <GradientText>Waarom kiezen voor QuoteFast?</GradientText>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ontdek de krachtige features die je bedrijf naar het volgende niveau tillen
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Video Section 1 - Glass styled play button */}
      <section className="container-app py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Zie QuoteFast Dashboard in Actie</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bekijk hoe eenvoudig het is om offertes te genereren, klanten te beheren en je bedrijf te laten groeien
          </p>
        </div>
        
        {/* Video Placeholder - Glass styled */}
        <div className="relative max-w-4xl mx-auto">
          <div className="glass-card aspect-video rounded-2xl flex items-center justify-center group cursor-pointer p-8">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Play className="w-8 h-8 text-primary ml-1" />
            </motion.div>
            <p className="text-foreground font-medium text-lg">QuoteFast Dashboard Demo</p>
            <p className="text-muted-foreground text-sm mt-2">AI Offertegenerator & CRM</p>
          </div>
        </div>
      </section>

      {/* Video Section 2 - Glass styled */}
      <section className="container-app py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Veilige Authenticatie & Gebruikersbeheer</h2>
            <p className="text-muted-foreground text-lg mb-8">
              QuoteFast biedt complete authenticatie flows voor email, social login, en meer. 
              Beveilig je gebruikersaccounts met enterprise-grade security.
            </p>
            
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Email Authenticatie</h3>
                  <p className="text-muted-foreground text-sm">Gebruikers kunnen inloggen met email en wachtwoord met veilige validatie.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Social Login</h3>
                  <p className="text-muted-foreground text-sm">Ondersteuning voor Google, Facebook, LinkedIn en meer OAuth providers.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Magic Links</h3>
                  <p className="text-muted-foreground text-sm">Wachtwoordloze authenticatie met veilige email link verificatie.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Wachtwoord Reset</h3>
                  <p className="text-muted-foreground text-sm">Geautomatiseerde wachtwoord reset flow met veilige token validatie.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Video Content - Glass styled */}
          <div className="relative">
            <div className="glass-card aspect-video rounded-2xl flex items-center justify-center group cursor-pointer p-8">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Play className="w-8 h-8 text-primary ml-1" />
              </motion.div>
              <p className="text-foreground font-medium text-lg">Authenticatie Demo</p>
              <p className="text-muted-foreground text-sm mt-2">Login & Registratie Flow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section 3 - Glass styled */}
      <section className="container-app py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Video Content */}
          <div className="relative order-2 lg:order-1">
            <div className="glass-card aspect-video rounded-2xl flex items-center justify-center group cursor-pointer p-8">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Play className="w-8 h-8 text-primary ml-1" />
              </motion.div>
              <p className="text-foreground font-medium text-lg">AI Offertegenerator</p>
              <p className="text-muted-foreground text-sm mt-2">Smart Quote Generation</p>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-white mb-6">AI-Powered Offertegenerator</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Laat AI automatisch professionele offertes genereren op basis van je producten en diensten. 
              Bespaar uren werk en verhoog je conversie met slimme suggesties.
            </p>
            
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Slimme Productherkenning</h3>
                  <p className="text-muted-foreground text-sm">AI herkent automatisch producten en stelt de juiste prijzen voor.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Automatische Berekenen</h3>
                  <p className="text-muted-foreground text-sm">BTW, kortingen en totaalbedragen worden automatisch berekend.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Professionele Templates</h3>
                  <p className="text-muted-foreground text-sm">Kies uit verschillende professionele offerte templates.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">PDF Export</h3>
                  <p className="text-muted-foreground text-sm">Exporteer offertes direct naar PDF voor verzending naar klanten.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section 4 - Glass styled */}
      <section className="container-app py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Teams & Samenwerking</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Laat je gebruikers teams aanmaken en resources delen met andere leden. 
              Perfect voor bureaus, consultants en groeiende bedrijven.
            </p>
            
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Organisaties/Teams</h3>
                  <p className="text-muted-foreground text-sm">Ingebouwde ondersteuning voor gebruikersgroepen die resources en permissies kunnen delen.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Gebruiker Uitnodigingen</h3>
                  <p className="text-muted-foreground text-sm">Gebruikers kunnen nieuwe leden uitnodigen, rollen toewijzen en toegang tot features beheren.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Lid Rollen</h3>
                  <p className="text-muted-foreground text-sm">Eigenaar, Admin, Lid rollen met verschillende permissieniveaus.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 glass-card p-3 rounded-xl">
                <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Resource Delen</h3>
                  <p className="text-muted-foreground text-sm">Deel projecten, documenten en data veilig tussen teamleden.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Video Content - Glass styled */}
          <div className="relative">
            <div className="glass-card aspect-video rounded-2xl flex items-center justify-center group cursor-pointer p-8">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Play className="w-8 h-8 text-primary ml-1" />
              </motion.div>
              <p className="text-foreground font-medium text-lg">Team Beheer</p>
              <p className="text-muted-foreground text-sm mt-2">Multi-Tenancy Demo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section - Glass styled */}
      <section className="container-app py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Complete SaaS Solution</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            QuoteFast is meer dan alleen offertes. Het is een complete business management suite 
            met alle tools die je nodig hebt om je bedrijf te laten groeien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl border-border hover:shadow-lg"
          >
            <motion.div 
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mb-6 mx-auto"
            >
              <Users className="w-6 h-6 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-3">CRM & Klantbeheer</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Beheer al je klanten, leads en contacten op één plek. Track conversaties, 
              notities en follow-ups voor betere klantrelaties.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl border-border hover:shadow-lg"
          >
            <motion.div 
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mb-6 mx-auto"
            >
              <Shield className="w-6 h-6 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Facturatie & Betalingen</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automatische facturatie, betalingsherinneringen en integratie met Stripe. 
              Accepteer betalingen online en houd je cashflow in de gaten.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl border-border hover:shadow-lg"
          >
            <motion.div 
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mb-6 mx-auto"
            >
              <Zap className="w-6 h-6 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Workflow Automatisering</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automatiseer repetitieve taken met slimme workflows. Van lead capture 
              tot factuur verzending - alles draait automatisch.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl border-border hover:shadow-lg"
          >
            <motion.div 
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mb-6 mx-auto"
            >
              <Code className="w-6 h-6 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-3">API & Integraties</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Krachtige API voor integraties met je bestaande tools. Webhooks, 
              Zapier, en custom integraties voor maximale flexibiliteit.
            </p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl border-border hover:shadow-lg"
          >
            <motion.div 
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mb-6 mx-auto"
            >
              <Rocket className="w-6 h-6 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Rapportage & Analytics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Inzichtelijke dashboards en rapporten. Track je omzet, conversies 
              en klantgedrag voor betere business beslissingen.
            </p>
          </motion.div>

          {/* Feature 6 */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl border-border hover:shadow-lg"
          >
            <motion.div 
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mb-6 mx-auto"
            >
              <Heart className="w-6 h-6 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Klantportaal</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Geef je klanten toegang tot hun eigen portaal. Bekijk offertes, 
              facturen en projectstatus in real-time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section - Glass styled */}
      <PricingSection />

      {/* CTA Section - Glass styled buttons */}
      <section className="container-app py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Klaar om je Bedrijf te Laten Groeien?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Sluit je aan bij honderden ondernemers die al hun offertes automatiseren met QuoteFast
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button href="/register" variant="premium" size="lg" className="shadow-lg">
              Start Gratis Proberen
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button href="/features" variant="glass" size="lg">
              Bekijk Alle Features
            </Button>
          </div>

          {/* Trust indicators - Glass styled */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Geen setup kosten</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
              <Shield className="w-4 h-4 text-success" />
              <span>GDPR compliant</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-success" />
              <span>500+ tevreden klanten</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}
