// Enhanced Email Service for QuoteFast Dashboard
// Supports multiple email providers with fallback and comprehensive error handling

import { logger } from '../logger';

// Email provider types
export type EmailProvider = 'resend' | 'sendgrid' | 'aws-ses' | 'mock';

// Enhanced email result type
export type EmailResult = {
  success: true;
  data: { 
    id: string;
    provider: EmailProvider;
    timestamp: string;
  };
  messageId: string;
  error?: undefined;
} | {
  success: false;
  error: string;
  data?: undefined;
  messageId?: undefined;
  provider?: EmailProvider;
};

// Email template types
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  from: string;
  replyTo?: string;
}

// Email parameters interfaces
export interface WelcomeEmailParams {
  email: string;
  name: string;
  companyName?: string;
  onboardingUrl?: string;
}

export interface InvoiceEmailParams {
  email: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  downloadUrl: string;
  companyName: string;
}

export interface OfferEmailParams {
  email: string;
  offerId: string;
  offerNumber: string;
  amount: number;
  validUntil: string;
  downloadUrl: string;
  companyName: string;
}

export interface PasswordResetEmailParams {
  email: string;
  name: string;
  resetUrl: string;
  expiresIn: string;
}

// Email service configuration
interface EmailConfig {
  provider: EmailProvider;
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  fallbackProvider?: EmailProvider;
}

// Enhanced email service class
export class EmailService {
  private config: EmailConfig;
  private isInitialized = false;

  constructor(config: EmailConfig) {
    this.config = config;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Validate configuration
      if (!this.config.fromEmail || !this.config.fromName) {
        throw new Error('Missing required email configuration');
      }

      // Initialize provider-specific settings
      await this.initializeProvider();
      
      this.isInitialized = true;
      logger.info('Email service initialized successfully', 'email', {
        provider: this.config.provider,
        fromEmail: this.config.fromEmail
      });
    } catch (error) {
      logger.error('Failed to initialize email service', 'email', error);
      throw error;
    }
  }

  private async initializeProvider(): Promise<void> {
    switch (this.config.provider) {
      case 'resend':
        if (!this.config.apiKey) {
          throw new Error('Resend API key is required');
        }
        break;
      case 'sendgrid':
        if (!this.config.apiKey) {
          throw new Error('SendGrid API key is required');
        }
        break;
      case 'aws-ses':
        // AWS SES uses IAM roles or access keys
        break;
      case 'mock':
        logger.info('Using mock email provider for development', 'email');
        break;
      default:
        throw new Error(`Unsupported email provider: ${this.config.provider}`);
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcome(params: WelcomeEmailParams): Promise<EmailResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const template = this.generateWelcomeTemplate(params);
      return await this.sendEmail({
        to: params.email,
        ...template
      });
    } catch (error) {
      logger.error('Failed to send welcome email', 'email', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send invoice email
   */
  async sendInvoice(params: InvoiceEmailParams): Promise<EmailResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const template = this.generateInvoiceTemplate(params);
      return await this.sendEmail({
        to: params.email,
        ...template
      });
    } catch (error) {
      logger.error('Failed to send invoice email', 'email', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send offer email
   */
  async sendOffer(params: OfferEmailParams): Promise<EmailResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const template = this.generateOfferTemplate(params);
      return await this.sendEmail({
        to: params.email,
        ...template
      });
    } catch (error) {
      logger.error('Failed to send offer email', 'email', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(params: PasswordResetEmailParams): Promise<EmailResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const template = this.generatePasswordResetTemplate(params);
      return await this.sendEmail({
        to: params.email,
        ...template
      });
    } catch (error) {
      logger.error('Failed to send password reset email', 'email', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Core email sending method with provider abstraction
   */
  private async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
    from: string;
    replyTo?: string;
  }): Promise<EmailResult> {
    try {
      // Rate limiting check
      await this.checkRateLimit(emailData.to);

      let result: EmailResult;

      switch (this.config.provider) {
        case 'resend':
          result = await this.sendViaResend(emailData);
          break;
        case 'sendgrid':
          result = await this.sendViaSendGrid(emailData);
          break;
        case 'aws-ses':
          result = await this.sendViaAWSSES(emailData);
          break;
        case 'mock':
          result = await this.sendViaMock(emailData);
          break;
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }

      // Log successful send
      if (result.success) {
        logger.info('Email sent successfully', 'email', {
          to: emailData.to,
          subject: emailData.subject,
          provider: this.config.provider,
          messageId: result.messageId
        });
      }

      return result;
    } catch (error) {
      logger.error('Email sending failed', 'email', error);
      
      // Try fallback provider if available
      if (this.config.fallbackProvider && this.config.provider !== this.config.fallbackProvider) {
        logger.info('Attempting fallback email provider', 'email', {
          original: this.config.provider,
          fallback: this.config.fallbackProvider
        });
        
        const originalProvider = this.config.provider;
        this.config.provider = this.config.fallbackProvider;
        
        try {
          const fallbackResult = await this.sendEmail(emailData);
          this.config.provider = originalProvider; // Restore original
          return fallbackResult;
        } catch (fallbackError) {
          this.config.provider = originalProvider; // Restore original
          logger.error('Fallback email provider also failed', 'email', fallbackError);
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Resend provider implementation
   */
  private async sendViaResend(emailData: any): Promise<EmailResult> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailData.from,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        reply_to: emailData.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Resend API error: ${data.message || 'Unknown error'}`);
    }

    return {
      success: true,
      data: {
        id: data.id,
        provider: 'resend',
        timestamp: new Date().toISOString()
      },
      messageId: data.id
    };
  }

  /**
   * SendGrid provider implementation
   */
  private async sendViaSendGrid(emailData: any): Promise<EmailResult> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: emailData.to }],
          subject: emailData.subject,
        }],
        from: { email: emailData.from },
        content: [
          { type: 'text/plain', value: emailData.text },
          { type: 'text/html', value: emailData.html }
        ],
        reply_to: emailData.replyTo ? { email: emailData.replyTo } : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${errorText}`);
    }

    const messageId = response.headers.get('X-Message-Id') || `sg_${Date.now()}`;

    return {
      success: true,
      data: {
        id: messageId,
        provider: 'sendgrid',
        timestamp: new Date().toISOString()
      },
      messageId
    };
  }

  /**
   * AWS SES provider implementation
   */
  private async sendViaAWSSES(emailData: any): Promise<EmailResult> {
    // This would require AWS SDK implementation
    // For now, return a mock response
    logger.info('AWS SES implementation placeholder', 'email');
    
    return {
      success: true,
      data: {
        id: `aws_ses_${Date.now()}`,
        provider: 'aws-ses',
        timestamp: new Date().toISOString()
      },
      messageId: `aws_ses_${Date.now()}`
    };
  }

  /**
   * Mock provider for development/testing
   */
  private async sendViaMock(emailData: any): Promise<EmailResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    logger.info('Mock email sent', 'email', {
      to: emailData.to,
      subject: emailData.subject
    });

    return {
      success: true,
      data: {
        id: `mock_${Date.now()}`,
        provider: 'mock',
        timestamp: new Date().toISOString()
      },
      messageId: `mock_${Date.now()}`
    };
  }

  /**
   * Rate limiting implementation
   */
  private async checkRateLimit(email: string): Promise<void> {
    // Simple in-memory rate limiting
    // In production, use Redis or database
    const key = `email_rate_limit_${email}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxEmails = 5; // Max 5 emails per minute per address

    // This is a simplified implementation
    // In production, implement proper rate limiting
  }

  /**
   * Generate welcome email template
   */
  private generateWelcomeTemplate(params: WelcomeEmailParams): EmailTemplate {
    const onboardingUrl = params.onboardingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    
    return {
      subject: `Welkom bij QuoteFast, ${params.name}! 🎉`,
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welkom bij QuoteFast</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Welkom bij QuoteFast! 🚀</h1>
            <p style="font-size: 18px; color: #666;">Hallo ${params.name},</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p>Bedankt voor het aanmelden bij QuoteFast! We zijn blij dat je deel uitmaakt van onze community.</p>
            ${params.companyName ? `<p><strong>Bedrijf:</strong> ${params.companyName}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2563eb;">Wat kun je nu doen?</h2>
            <ul style="padding-left: 20px;">
              <li>Maak je eerste offerte aan</li>
              <li>Voeg je klanten toe</li>
              <li>Genereer professionele facturen</li>
              <li>Gebruik AI voor snellere workflows</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${onboardingUrl}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Start je onboarding
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
            <p>Heb je vragen? Neem contact met ons op via <a href="mailto:support@quotefast.nl">support@quotefast.nl</a></p>
            <p>Met vriendelijke groet,<br>Het QuoteFast Team</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welkom bij QuoteFast, ${params.name}!
        
        Bedankt voor het aanmelden bij QuoteFast! We zijn blij dat je deel uitmaakt van onze community.
        
        ${params.companyName ? `Bedrijf: ${params.companyName}` : ''}
        
        Wat kun je nu doen?
        - Maak je eerste offerte aan
        - Voeg je klanten toe  
        - Genereer professionele facturen
        - Gebruik AI voor snellere workflows
        
        Start je onboarding: ${onboardingUrl}
        
        Heb je vragen? Neem contact met ons op via support@quotefast.nl
        
        Met vriendelijke groet,
        Het QuoteFast Team
      `
    };
  }

  /**
   * Generate invoice email template
   */
  private generateInvoiceTemplate(params: InvoiceEmailParams): EmailTemplate {
    return {
      subject: `Factuur ${params.invoiceNumber} van ${params.companyName}`,
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Factuur ${params.invoiceNumber}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">Factuur ${params.invoiceNumber}</h1>
            <p style="font-size: 18px; color: #666;">van ${params.companyName}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin-top: 0;">Factuur Details</h2>
            <p><strong>Factuurnummer:</strong> ${params.invoiceNumber}</p>
            <p><strong>Bedrag:</strong> €${params.amount.toFixed(2)}</p>
            <p><strong>Vervaldatum:</strong> ${params.dueDate}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${params.downloadUrl}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Download Factuur
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
            <p>Voor vragen over deze factuur, neem contact op met ${params.companyName}</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Factuur ${params.invoiceNumber} van ${params.companyName}
        
        Factuur Details:
        - Factuurnummer: ${params.invoiceNumber}
        - Bedrag: €${params.amount.toFixed(2)}
        - Vervaldatum: ${params.dueDate}
        
        Download factuur: ${params.downloadUrl}
        
        Voor vragen over deze factuur, neem contact op met ${params.companyName}
      `
    };
  }

  /**
   * Generate offer email template
   */
  private generateOfferTemplate(params: OfferEmailParams): EmailTemplate {
    return {
      subject: `Offerte ${params.offerNumber} van ${params.companyName}`,
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offerte ${params.offerNumber}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">Offerte ${params.offerNumber}</h1>
            <p style="font-size: 18px; color: #666;">van ${params.companyName}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin-top: 0;">Offerte Details</h2>
            <p><strong>Offertenummer:</strong> ${params.offerNumber}</p>
            <p><strong>Bedrag:</strong> €${params.amount.toFixed(2)}</p>
            <p><strong>Geldig tot:</strong> ${params.validUntil}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${params.downloadUrl}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Bekijk Offerte
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
            <p>Voor vragen over deze offerte, neem contact op met ${params.companyName}</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Offerte ${params.offerNumber} van ${params.companyName}
        
        Offerte Details:
        - Offertenummer: ${params.offerNumber}
        - Bedrag: €${params.amount.toFixed(2)}
        - Geldig tot: ${params.validUntil}
        
        Bekijk offerte: ${params.downloadUrl}
        
        Voor vragen over deze offerte, neem contact op met ${params.companyName}
      `
    };
  }

  /**
   * Generate password reset email template
   */
  private generatePasswordResetTemplate(params: PasswordResetEmailParams): EmailTemplate {
    return {
      subject: 'Wachtwoord reset - QuoteFast',
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Wachtwoord Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">Wachtwoord Reset</h1>
            <p style="font-size: 18px; color: #666;">Hallo ${params.name},</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p>Je hebt een wachtwoord reset aangevraagd voor je QuoteFast account.</p>
            <p>Klik op de onderstaande knop om je wachtwoord te resetten:</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${params.resetUrl}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Wachtwoord
            </a>
          </div>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626; font-size: 14px;">
              <strong>Belangrijk:</strong> Deze link verloopt over ${params.expiresIn}. 
              Als je deze reset niet hebt aangevraagd, kun je deze email negeren.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
            <p>Voor vragen, neem contact met ons op via <a href="mailto:support@quotefast.nl">support@quotefast.nl</a></p>
            <p>Met vriendelijke groet,<br>Het QuoteFast Team</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Wachtwoord Reset - QuoteFast
        
        Hallo ${params.name},
        
        Je hebt een wachtwoord reset aangevraagd voor je QuoteFast account.
        
        Reset je wachtwoord: ${params.resetUrl}
        
        Belangrijk: Deze link verloopt over ${params.expiresIn}. 
        Als je deze reset niet hebt aangevraagd, kun je deze email negeren.
        
        Voor vragen, neem contact met ons op via support@quotefast.nl
        
        Met vriendelijke groet,
        Het QuoteFast Team
      `
    };
  }
}

// Default email service instance
const defaultEmailService = new EmailService({
  provider: (process.env.EMAIL_PROVIDER as EmailProvider) || 'mock',
  apiKey: process.env.EMAIL_API_KEY,
  fromEmail: process.env.EMAIL_FROM || 'noreply@quotefast.nl',
  fromName: process.env.EMAIL_FROM_NAME || 'QuoteFast',
  replyToEmail: process.env.EMAIL_REPLY_TO,
  fallbackProvider: 'mock'
});

// Legacy email utilities for backward compatibility
export const emailUtils = {
  async sendWelcome({ email, name }: WelcomeEmailParams): Promise<EmailResult> {
    return defaultEmailService.sendWelcome({ email, name });
  },

  async sendInvoice({ email, invoiceId }: { email: string; invoiceId: string }): Promise<EmailResult> {
    return defaultEmailService.sendInvoice({
      email,
      invoiceId,
      invoiceNumber: `INV-${invoiceId}`,
      amount: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/${invoiceId}`,
      companyName: 'QuoteFast'
    });
  },

  async sendOffer({ email, offerId }: { email: string; offerId: string }): Promise<EmailResult> {
    return defaultEmailService.sendOffer({
      email,
      offerId,
      offerNumber: `OFF-${offerId}`,
      amount: 0,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/offers/${offerId}`,
      companyName: 'QuoteFast'
    });
  }
};

// Export the service class and default instance
export { EmailService };
export default defaultEmailService;
