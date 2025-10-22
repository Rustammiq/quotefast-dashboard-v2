export interface DashboardData {
  offersSent: number;
  avgOfferValue: string;
  activeCustomers: number;
  aiGenerations: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  client?: string;
  description?: string;
  amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
  notes?: string;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  offerNumber: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  items: OfferItem[];
  notes?: string;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
}

export interface OfferItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceValue: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
}

// AI & Performance Types
export interface AIGeneration {
  id: string;
  type: 'offer' | 'invoice' | 'email' | 'content';
  prompt: string;
  response: string;
  tokensUsed: number;
  model: string;
  createdAt: string;
  processingTime: number;
  success: boolean;
  error?: string;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  bundleSize: number;
  memoryUsage: number;
}

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  preferences: UserPreferences;
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: NotificationSettings;
  dashboard: DashboardPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  invoiceUpdates: boolean;
  offerUpdates: boolean;
  systemUpdates: boolean;
  marketing: boolean;
}

export interface DashboardPreferences {
  defaultView: 'overview' | 'offers' | 'invoices' | 'customers';
  widgets: string[];
  layout: 'grid' | 'list';
  refreshInterval: number;
}

export interface Subscription {
  id: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// Chart & Analytics Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  revenue: ChartData;
  invoices: ChartData;
  offers: ChartData;
  customers: ChartData;
  conversionRate: number;
  averageDealSize: number;
  topCustomers: Customer[];
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'invoice_created' | 'offer_sent' | 'payment_received' | 'customer_added';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  metadata?: Record<string, any>;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  userId?: string;
  stack?: string;
}

// Settings Types
export interface AppSettings {
  general: GeneralSettings;
  integrations: IntegrationSettings;
  security: SecuritySettings;
  billing: BillingSettings;
}

export interface GeneralSettings {
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  logo?: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  taxRate: number;
}

export interface IntegrationSettings {
  email: EmailSettings;
  whatsapp: WhatsAppSettings;
  stripe: StripeSettings;
  ai: AISettings;
}

export interface EmailSettings {
  provider: 'smtp' | 'sendgrid' | 'mailgun';
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  templates: EmailTemplate[];
}

export interface WhatsAppSettings {
  enabled: boolean;
  apiKey?: string;
  phoneNumber?: string;
  templates: WhatsAppTemplate[];
}

export interface StripeSettings {
  enabled: boolean;
  publishableKey?: string;
  secretKey?: string;
  webhookSecret?: string;
}

export interface AISettings {
  provider: 'gemini' | 'openai' | 'anthropic';
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'invoice' | 'offer' | 'welcome' | 'reminder';
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  message: string;
  type: 'invoice' | 'offer' | 'reminder';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordPolicy: PasswordPolicy;
  ipWhitelist: string[];
  auditLogging: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAge: number;
}

export interface BillingSettings {
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  offerPrefix: string;
  paymentTerms: number;
  lateFeeRate: number;
  autoReminders: boolean;
  reminderDays: number[];
}