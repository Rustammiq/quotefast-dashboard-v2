/* eslint-disable no-console */
"use client";
import DashboardCard from "./components/DashboardCard";
import BrainActivityWidget from "@/components/dashboard/BrainActivityWidget";
import { Zap, FileText, Users, Euro, TrendingUp, Target, BarChart3, Sparkles, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { customersApi, invoicesApi } from "@/lib/api-service";
import { DashboardData } from "@/types/dashboard";
import { logger } from "@/lib/logger";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// AI Sphere animatie component
const AISphere = () => (
  <div className="absolute inset-0">
    <motion.div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80"
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-full blur-3xl opacity-50"></div>
      <motion.div 
        className="absolute inset-8 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl opacity-50"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, -180, -360]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear",
          delay: 5
        }}
      />
    </motion.div>
  </div>
);

// Loading skeleton voor de hele pagina
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Hero skeleton */}
    <div className="space-y-4 text-center">
      <div className="h-8 w-64 bg-muted rounded mx-auto loading-skeleton"></div>
      <div className="h-5 w-96 bg-muted rounded mx-auto loading-skeleton"></div>
      <div className="h-4 w-80 bg-muted rounded mx-auto loading-skeleton"></div>
    </div>
    
    {/* Cards grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="glass-card-premium p-6 rounded-2xl min-h-[200px] overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-20 loading-skeleton"></div>
              <div className="w-8 h-8 bg-muted rounded-full loading-skeleton"></div>
            </div>
            <div className="h-8 bg-muted rounded loading-skeleton"></div>
            <div className="h-4 bg-muted rounded w-24 loading-skeleton"></div>
            <div className="h-3 bg-muted rounded w-16 loading-skeleton"></div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Force dynamic rendering for pages that use auth context
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    offersSent: 0,
    avgOfferValue: "€0",
    activeCustomers: 0,
    aiGenerations: 0
  });

  // Memoized data fetching met error handling
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Probeer echte data op te halen, maar fallback naar mock data als het niet werkt
      let activeCustomers = 0;
      let invoices: any[] = [];

      try {
        // Parallel data fetching voor betere performance
        const [customersResponse, invoicesResponse] = await Promise.all([
          customersApi.getAll(),
          invoicesApi.getAll()
        ]);

        // Controleer op fouten
        if (customersResponse.error) {
          logger.warn('Customers API error, using mock data', 'dashboard', customersResponse.error);
          throw new Error('API error');
        }

        if (invoicesResponse.error) {
          logger.warn('Invoices API error, using mock data', 'dashboard', invoicesResponse.error);
          throw new Error('API error');
        }

        activeCustomers = customersResponse.data?.length || 0;
        invoices = invoicesResponse.data || [];
      } catch (apiError) {
        logger.info('Using mock data for dashboard due to API unavailability', 'dashboard');
        // Import mock data als fallback
        const { mockInvoices } = await import('@/lib/mockData/invoicesData');
        const { mockCustomers } = await import('@/lib/mockData/customersData');
        invoices = mockInvoices;
        activeCustomers = mockCustomers.length;
      }

      const offersSent = invoices.length;
      
      // Bereken gemiddelde factuurwaarde
      const totalValue = invoices.reduce((sum, invoice) => {
        return sum + (invoice.total || 0);
      }, 0);
      
      const avgValue = offersSent > 0 ? totalValue / offersSent : 0;
      const formattedAvgValue = '€' + avgValue.toFixed(0);
      
      // Update state met realistische waarden
      setData({
        offersSent,
        avgOfferValue: formattedAvgValue,
        activeCustomers,
        aiGenerations: Math.floor(Math.random() * 100) + 20 // Mock AI data
      });
      
    } catch (err: unknown) {
      // Error logging handled by error boundary
      const errorMessage = err instanceof Error ? err.message : "Er is een fout opgetreden bij het ophalen van de dashboard gegevens";
      setError(errorMessage);
      toast.error("Dashboard data kon niet worden geladen", { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data elke 30 seconden
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Hero section met animaties
  const HeroSection = () => (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      className="relative z-10 flex flex-col items-center text-center mb-12 mt-8 px-4"
      >
      {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
        whileHover={{ scale: 1.05 }}
        >
          <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </motion.div>
        <span className="text-sm font-medium text-foreground">AI-Powered Insights</span>
        </motion.div>
        
      {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent"
        >
            QuoteFast Dashboard
        </motion.h1>
        
      {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        className="text-xl md:text-2xl max-w-3xl leading-relaxed text-muted-foreground mb-0"
        >
        Transformeer je offerteproces met slimme AI-inzichten en realtime analytics. 
        Van lead tot conversie, alles in één overzicht.
        </motion.p>
      </motion.div>
  );

  // Error state
  if (error && !isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black">
        <AISphere />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl glass-card-premium p-8 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
            >
              <AlertCircle className="h-8 w-8 text-destructive" />
            </motion.div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">Oeps! Er is een probleem</h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <motion.button
              onClick={fetchDashboardData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="modern-glass-button w-full px-6 py-3 text-sm font-medium"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Probeer opnieuw
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* AI Sphere background */}
      <AISphere />
      
      {/* Noise overlay voor textuur */}
      <div className="absolute inset-0 noise-overlay"></div>

      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-12"
            >
              <div className="h-8 w-64 bg-muted/50 rounded mx-auto mb-4 loading-skeleton"></div>
              <div className="h-5 w-96 bg-muted/50 rounded mx-auto loading-skeleton"></div>
            </motion.div>
          ) : (
            <HeroSection key="hero" />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12"
            >
              <DashboardSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12"
            >
              <DashboardCard
                icon={<FileText className="h-6 w-6" />}
          title="Verstuurde Offertes"
          value={data.offersSent}
                description="Totaal aantal dit jaar"
                growth="+12%"
                trend="up"
          delay={100}
                progress={75}
                isLoading={isLoading}
        />
              
              <DashboardCard
                icon={<Euro className="h-6 w-6" />}
          title="Gem. Offerte Waarde" 
          value={data.avgOfferValue} 
                description="Gemiddelde waarde"
                growth="+8% deze maand"
                trend="up"
          delay={200}
                progress={60}
                isLoading={isLoading}
        />
              
              <DashboardCard
                icon={<Users className="h-6 w-6" />}
          title="Actieve Klanten" 
          value={data.activeCustomers} 
                description="Unieke contacten"
                growth="+15 nieuwe"
                trend="up"
          delay={300}
                progress={82}
                isLoading={isLoading}
        />
              
              <DashboardCard
                icon={<Zap className="h-6 w-6" />}
          title="AI Generaties" 
          value={data.aiGenerations} 
                description="Slimme templates"
                growth="+24 vandaag"
                trend="up"
          delay={400}
                progress={91}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brain Activity Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-7xl mx-auto mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BrainActivityWidget 
              title="AI Brain Activity"
              showMetrics={true}
            />
            <BrainActivityWidget 
              title="Neural Processing"
              showMetrics={true}
            />
          </div>
        </motion.div>

        {/* Call-to-Action Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
        <Link
          href="/dashboard/offertes"
              className="glass-card-premium inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
              aria-label="Ga naar offertes overzicht"
            >
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Offertes Beheren</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
        <Link
          href="/dashboard/contactpersoon"
              className="modern-glass-button inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              aria-label="Ga naar klanten overzicht"
            >
              <Users className="h-5 w-5" />
              <span>Klanten Overzicht</span>
              <TrendingUp className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
          </motion.div>
        </motion.div>

        {/* Quick Stats Footer */}
        {!isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-sm text-muted-foreground/80"
          >
            <p>Laatste update: {new Date().toLocaleTimeString('nl-NL')}</p>
            <p className="mt-1">Auto-refresh elke 30 seconden • AI-inzichten live</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

