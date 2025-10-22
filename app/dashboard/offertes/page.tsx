"use client";
import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { useTheme  } from '../../../contexts/ThemeContext';
import { getPersonalizedTemplates  } from '../../../lib/ai';
import DashboardCard from "../components/DashboardCard";
import { logger } from '../../../utils/helpers/logger';
import { mockOffers, getOffersStats  } from '../../../lib/mockData/offersData';
import { 
  FileText, Euro, Target, Clock, Users, Zap, Download, Filter, Search, 
  Plus, ChevronDown, ExternalLink, Loader2, BarChart3, TrendingUp 
} from 'lucide-react';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Lazy load heavy components met error boundaries
const DataTable = lazy(() => import("../components/DataTable"));
const OfferStatusChart = lazy(() => import("../components/OfferStatusChart"));
const OfferTimelineChart = lazy(() => import("../components/OfferTimelineChart"));
const OfferDetailsModal = lazy(() => import("../components/OfferDetailsModal"));

// Page Header Component
const PageHeader = ({ 
  title, 
  description, 
  onSearchChange, 
  searchValue, 
  onFilterClick, 
  onCreateClick,
  showSearch = true,
  showFilters = true,
  showCreateButton = true 
}: {
  title: string;
  description: string;
  onSearchChange: (value: string) => void;
  searchValue: string;
  onFilterClick: () => void;
  onCreateClick: () => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showCreateButton?: boolean;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      {/* Left side - Title & Description */}
      <div className="flex-1 min-w-0">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          {description}
        </motion.p>
      </div>

      {/* Right side - Search & Actions */}
      <div className="flex items-center gap-3 flex-1 sm:flex-none">
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative flex-1 min-w-0 max-w-md"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek offertes..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </motion.div>
        )}

        <AnimatePresence>
          {showFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.4 }}
              onClick={onFilterClick}
              className="glass-card p-2 rounded-lg hover:bg-accent hover:shadow-md transition-all flex items-center gap-2"
              aria-label="Filters"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Filters</span>
              <ChevronDown className="h-3 w-3" />
            </motion.button>
          )}
        </AnimatePresence>

        {showCreateButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateClick}
            className="glass-card-premium inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
            aria-label="Nieuwe offerte aanmaken"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:hidden">Nieuw</span>
            <span className="hidden sm:inline">Nieuwe Offerte</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Export Button Component
const ExportButton = ({ onExport, isExporting, format }: { 
  onExport: (format: 'pdf' | 'csv') => void; 
  isExporting: boolean; 
  format: 'pdf' | 'csv';
}) => {
  const icons = { pdf: <FileText className="h-4 w-4" />, csv: <Download className="h-4 w-4" /> };
  const labels = { pdf: 'PDF', csv: 'CSV' };

  return (
    <motion.button
      onClick={() => onExport(format)}
      disabled={isExporting}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="modern-glass-button inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icons[format]}
      <span>{labels[format]} Exporteren</span>
    </motion.button>
  );
};

// Filters Modal (simplified)
const FiltersModal = ({ isOpen, onClose, onApply }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onApply: (filters: any) => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card-premium w-full max-w-md max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="sticky top-0 p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={onClose} className="p-1 hover:bg-accent rounded-full" aria-label="Sluit filters">
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium mb-2">Status</label>
                <select id="status-filter" className="w-full p-2 border border-border rounded-lg bg-background">
                  <option value="">Alle</option>
                  <option value="draft">Concept</option>
                  <option value="sent">Verzonden</option>
                  <option value="accepted">Geaccepteerd</option>
                  <option value="expired">Verlopen</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Datum bereik</label>
                <div className="flex gap-2">
                  <input type="date" id="date-from" className="flex-1 p-2 border border-border rounded-lg bg-background" aria-label="Vanaf datum" />
                  <input type="date" id="date-to" className="flex-1 p-2 border border-border rounded-lg bg-background" aria-label="Tot datum" />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <motion.button
                  onClick={() => onApply({})}
                  whileHover={{ scale: 1.02 }}
                  className="modern-glass-button flex-1 px-4 py-2 rounded-lg"
                  aria-label="Filters toepassen"
                >
                  Toepassen
                </motion.button>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card flex-1 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent"
                  aria-label="Filters annuleren"
                >
                  Annuleren
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const dynamic = 'force-dynamic'

export default function OffertesPage() {
  const { theme } = useTheme();
  
  // Use mock data for static generation
  const onboardingData = null;
  
  const [offers, setOffers] = useState(mockOffers);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  const stats = useMemo(() => getOffersStats(), []);
  const personalizedTemplates = useMemo(() => 
    onboardingData ? getPersonalizedTemplates(onboardingData) : [], 
  [onboardingData]);
  
  // Simulate loading with better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(() => {
    const handler = setTimeout(() => {
      // Search logic hier
    }, 300);
    return () => clearTimeout(handler);
  }, []);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  // Filtered and sorted offers
  const filteredOffers = useMemo(() => {
    let filtered = [...offers];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.id.toString().includes(searchTerm)
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = (a as any)[sortConfig.key!];
        let bValue = (b as any)[sortConfig.key!];
        
        if (sortConfig.key === 'amount') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        } else if (sortConfig.key && sortConfig.key.includes('Date')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filtered.slice(startIndex, endIndex);
  }, [offers, searchTerm, sortConfig, currentPage]);

  const totalPages = Math.ceil(offers.length / 10);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px',
      render: (value: any) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'title',
      label: 'Offerte',
      sortable: true,
      render: (value: any, row: any) => (
        <div className="space-y-1">
          <span className="font-medium line-clamp-1">{value}</span>
          <span className="text-sm text-muted-foreground">{row.client}</span>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Bedrag',
      sortable: true,
      render: (value: any) => {
        return new Intl.NumberFormat('nl-NL', {
          style: 'currency',
          currency: 'EUR'
        }).format(value);
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: any) => {
        const statusConfig = {
          draft: { label: 'Concept', color: 'gray' },
          sent: { label: 'Verzonden', color: 'blue' },
          accepted: { label: 'Geaccepteerd', color: 'green' },
          expired: { label: 'Verlopen', color: 'red' },
          rejected: { label: 'Afgewezen', color: 'orange' }
        };
        
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.draft;
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900 dark:text-${config.color}-100`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'createdDate',
      label: 'Aangemaakt',
      sortable: true,
      render: (value: any) => {
        const date = new Date(value);
        return date.toLocaleDateString('nl-NL', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    {
      key: 'dueDate',
      label: 'Vervaldatum',
      sortable: true,
      render: (value: any) => {
        const date = new Date(value);
        const today = new Date();
        const isOverdue = date < today;
        
        return (
          <span className={`text-sm ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            {date.toLocaleDateString('nl-NL')}
          </span>
        );
      }
    }
  ];

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${format.toUpperCase()} export voltooid!`, { duration: 3000 });
      logger.info(`Export completed: ${format}`, 'offertes', { count: selectedRows.length || filteredOffers.length });
    } catch (error) {
      toast.error('Export mislukt', { duration: 4000 });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateOffer = () => {
    toast.success('Nieuwe offerte aangemaakt!', { duration: 3000 });
    logger.info('Create new offer', 'offertes');
    // Navigate to offer editor
  };

  const handleBulkAction = (action: string, rows: any[]) => {
    toast.success(`${action} toegepast op ${rows.length} offerte(s)`, { duration: 3000 });
    logger.info(`Bulk action: ${action}`, 'offertes', { count: rows.length });
    setSelectedRows([]);
  };

  const bulkActions = [
    { 
      label: `${selectedRows.length || filteredOffers.length} selecteren`, 
      action: 'selectAll', 
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      label: 'Exporteren', 
      action: 'export', 
      icon: <Download className="h-4 w-4" />,
      dropdown: [
        { label: 'PDF', action: () => handleExport('pdf'), icon: <FileText className="h-3 w-3 mr-2" /> },
        { label: 'CSV', action: () => handleExport('csv'), icon: <Download className="h-3 w-3 mr-2" /> },
      ]
    },
    { label: 'Verstuur herinnering', action: 'remind', icon: <Clock className="h-4 w-4" /> },
    { label: 'Markeer als verzonden', action: 'send', icon: <Zap className="h-4 w-4" /> },
  ];

  // Loading state met nieuwe shimmer
  if (isLoading) {
    return (
      <div className="min-h-screen space-y-8 p-6">
        {/* Header skeleton */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-muted rounded loading-skeleton"></div>
              <div className="h-4 w-80 bg-muted rounded loading-skeleton"></div>
        </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-64 bg-muted rounded-lg loading-skeleton"></div>
              <div className="h-10 w-12 bg-muted rounded-lg loading-skeleton"></div>
            </div>
          </div>
        </motion.div>

        {/* Stats cards skeleton */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl min-h-[180px]"
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
        </motion.div>

        {/* Charts skeleton */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 rounded-2xl min-h-[400px]"
            >
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-32 loading-skeleton"></div>
                <div className="h-[300px] bg-muted rounded loading-skeleton"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Table skeleton */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="h-6 bg-muted rounded w-48 loading-skeleton"></div>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-background/50 rounded-lg">
                <div className="h-4 bg-muted rounded flex-1 loading-skeleton"></div>
                <div className="h-4 bg-muted rounded w-24 loading-skeleton"></div>
                <div className="h-4 bg-muted rounded w-20 loading-skeleton"></div>
                <div className="h-4 bg-muted rounded w-24 loading-skeleton"></div>
                <div className="h-4 bg-muted rounded w-32 loading-skeleton"></div>
                <div className="h-4 bg-muted rounded w-24 loading-skeleton"></div>
            </div>
          ))}
        </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 p-6 bg-background">
      {/* Page Header */}
      <PageHeader
        title="Offertes Overzicht"
        description="Beheer, analyseer en optimaliseer je prijsvoorstellen met AI-inzichten"
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
        onFilterClick={() => setFiltersOpen(true)}
        onCreateClick={handleCreateOffer}
        showSearch={true}
        showFilters={true}
        showCreateButton={true}
      />

      {/* Filters Modal */}
      <FiltersModal 
        isOpen={filtersOpen} 
        onClose={() => setFiltersOpen(false)}
        onApply={() => setFiltersOpen(false)}
      />

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <DashboardCard
          title="Totaal Offertes"
          value={stats.total}
          growth="15%"
          icon={<FileText className="h-5 w-5" />}
          description="Alle offertes dit jaar"
          progress={75}
          delay={0}
          trend="up"
        />
        <DashboardCard
          title="Geaccepteerd"
          value={stats.accepted}
          growth="22%"
          icon={<Target className="h-5 w-5" />}
          description="Succesvolle conversies"
          progress={stats.acceptanceRate}
          delay={100}
          trend="up"
        />
        <DashboardCard
          title="Verzonden"
          value={stats.sent}
          growth="8%"
          icon={<Clock className="h-5 w-5" />}
          description="Deze maand verzonden"
          progress={60}
          delay={200}
          trend="up"
        />
        <DashboardCard
          title="Concepten"
          value={stats.draft}
          growth="-5%"
          icon={<FileText className="h-5 w-5" />}
          description="Nog te voltooien"
          progress={40}
          delay={300}
          trend="down"
        />
        <DashboardCard
          title="Gem. Waarde"
          value={`€${stats.avgValue.toLocaleString()}`}
          growth="12%"
          icon={<Euro className="h-5 w-5" />}
          description="Gemiddelde offerte"
          progress={68}
          delay={400}
          trend="up"
        />
        <DashboardCard
          title="Acceptatie Ratio"
          value={`${stats.acceptanceRate}%`}
          growth="8%"
          icon={<Target className="h-5 w-5" />}
          description="Conversiepercentage"
          progress={stats.acceptanceRate}
          delay={500}
          trend="up"
        />
      </motion.div>

      {/* AI Personalisatie Sectie */}
      <AnimatePresence>
      {onboardingData && personalizedTemplates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card-premium p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="p-2 glass-card rounded-xl"
              >
                <Zap className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  AI Aanbevolen Templates
            </h3>
                <p className="text-sm text-muted-foreground">
                  Voor jouw bedrijf • Alle sectoren
                </p>
              </div>
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedTemplates.slice(0, 3).map((template, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="glass-card p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    toast.success(`Template "${template.name}" geselecteerd`, { duration: 3000 });
                    logger.info('AI template selected', 'offertes', { template });
                  }}
                >
                  <h4 className="font-medium text-foreground mb-2 line-clamp-1">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-accent/50 rounded-full text-foreground/80">
                    {template.category}
                  </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                      aria-label={`Gebruik template ${template.name}`}
                    >
                      Gebruik Template →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {personalizedTemplates.length > 3 && (
              <motion.div
                className="mt-4 text-center"
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  href="/dashboard/templates"
                  className="modern-glass-button inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Bekijk alle templates
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8"
      >
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 glass-card rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Status Overzicht</h3>
                <p className="text-sm text-muted-foreground">Offerte status verdeling</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="modern-glass-button p-2 rounded-lg"
              onClick={() => toast('Chart interactie', { duration: 2000 })}
              aria-label="Chart opties"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.button>
          </div>
          <Suspense fallback={
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <OfferStatusChart />
          </Suspense>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 glass-card rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              <div>
                <h3 className="font-semibold text-foreground">Tijdslijn</h3>
                <p className="text-sm text-muted-foreground">Offerte activiteit</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="modern-glass-button p-2 rounded-lg"
              onClick={() => toast('Tijdslijn interactie', { duration: 2000 })}
              aria-label="Tijdslijn opties"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.button>
          </div>
          <Suspense fallback={
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <OfferTimelineChart />
          </Suspense>
        </motion.div>
      </motion.section>

      {/* Table Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Table Header met bulk actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">
              Offertes Lijst ({filteredOffers.length} van {offers.length})
            </h3>
            {selectedRows.length > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {selectedRows.length} geselecteerd
              </span>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions.map((action, index) => (
                <motion.button
                  key={action.action}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleBulkAction(action.action, selectedRows)}
                  className="modern-glass-button inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </motion.button>
              ))}
              
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setSelectedRows([])}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Deselecteer
              </motion.button>
            </div>
          )}

          {/* Export buttons */}
          <div className="flex items-center gap-2">
            <ExportButton 
              onExport={handleExport} 
              isExporting={isExporting} 
              format="pdf" 
            />
            <ExportButton 
              onExport={handleExport} 
              isExporting={isExporting} 
              format="csv" 
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Pagina {currentPage} van {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              whileHover={{ scale: 1.05 }}
              className="modern-glass-button p-2 rounded-lg disabled:opacity-50"
              aria-label="Vorige pagina"
            >
              Vorige
            </motion.button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
              return (
                <motion.button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`modern-glass-button p-2 rounded-lg px-3 ${
                    page === currentPage ? 'bg-primary text-primary-foreground shadow-md' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  aria-label={`Ga naar pagina ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </motion.button>
              );
            })}
            
            <motion.button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              whileHover={{ scale: 1.05 }}
              className="modern-glass-button p-2 rounded-lg disabled:opacity-50"
              aria-label="Volgende pagina"
            >
              Volgende
            </motion.button>
          </div>
      </div>

        {/* Data Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <Suspense fallback={
            <div className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Laden...</p>
            </div>
          }>
      <DataTable
        data={filteredOffers}
        columns={columns}
              onRowClick={(offer) => {
                setSelectedOffer(offer);
                setIsModalOpen(true);
              }}
        onBulkAction={handleBulkAction}
        bulkActions={bulkActions}
        selectable={true}
              onSort={handleSort}
              // sortConfig={sortConfig}
              // emptyMessage={
                // <div className="text-center py-12">
                //   <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                //   <h3 className="text-lg font-medium text-foreground mb-2">Geen offertes gevonden</h3>
                //   <p className="text-muted-foreground mb-6">
                //     {searchTerm ? `Geen resultaten voor "${searchTerm}"` : 'Maak je eerste offerte aan om te beginnen.'}
                //   </p>
                //   <motion.button
                //     onClick={handleCreateOffer}
                //     whileHover={{ scale: 1.05 }}
                //     className="modern-glass-button inline-flex items-center gap-2 px-4 py-2"
                //   >
                //     <Plus className="h-4 w-4" />
                //     Nieuwe Offerte
                //   </motion.button>
                // </div>
              // }
              // pageCount={totalPages}
              // currentPage={currentPage}
              // onPageChange={setCurrentPage}
            />
          </Suspense>
        </motion.div>
      </motion.section>

      {/* Offer Details Modal */}
      <Suspense fallback={<div>Loading...</div>}>
      <OfferDetailsModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOffer(null);
        }}
        onEdit={(offer) => logger.info('Edit offer', 'offertes', { offer })}
        onSend={(offer) => logger.info('Send offer', 'offertes', { offer })}
        onDownload={(offer) => logger.info('Download offer', 'offertes', { offer })}
      />
      </Suspense>
    </div>
  );
}
