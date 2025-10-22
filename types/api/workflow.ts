export enum WorkflowStatus {
  PENDING = 'pending',
  CONTACT_PROCESSING = 'contact-processing',
  CONTACT_SUCCESS = 'contact-success',
  QUOTE_PROCESSING = 'quote-processing',
  QUOTE_SUCCESS = 'quote-success',
  EMAIL_PROCESSING = 'email-processing',
  EMAIL_SUCCESS = 'email-success',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum AgentName {
  CONTACT_READER = 'ContactReaderAgent',
  QUOTE_MAKER = 'QuoteMakerAgent',
  EMAIL_SENDER = 'EmailSenderAgent',
  ORCHESTRATOR = 'WorkflowOrchestrator',
}

export interface ContactData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  message: string;
  requirements?: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuoteData {
  amount: number;
  currency: string;
  description: string;
  items: QuoteItem[];
  validUntil: string;
  terms?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  sentAt?: string;
  messageId?: string;
}

export interface Workflow {
  id: string;
  status: WorkflowStatus;
  contactData?: ContactData;
  quoteData?: QuoteData;
  emailData?: EmailData;
  currentAgent?: AgentName;
  createdAt: string;
  updatedAt: string;
}

export type AgentLogStatus = 'success' | 'error' | 'processing';

export interface AgentLog {
  id: string;
  workflowId: string;
  agentName: AgentName;
  action: string;
  inputData: any;
  outputData: any;
  status: AgentLogStatus;
  processingTimeMs?: number;
  errorMessage?: string;
  createdAt: string;
}

export interface AgentResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  processingTimeMs: number;
}
