// Email utilities and services

type EmailResult = {
  success: true;
  data: { id: string };
  messageId: string;
  error?: undefined;
} | {
  success: false;
  error: string;
  data?: undefined;
  messageId?: undefined;
};

interface WelcomeEmailParams {
  email: string;
  name: string;
}

export const emailUtils = {
  async sendWelcome({ email, name }: WelcomeEmailParams): Promise<EmailResult> {
    try {
      // Mock implementation - replace with actual email service
      console.log(`Sending welcome email to ${email} for ${name}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        data: { id: `email_${Date.now()}` },
        messageId: `msg_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: undefined,
        messageId: undefined
      };
    }
  },

  async sendInvoice({ email, invoiceId }: { email: string; invoiceId: string }): Promise<EmailResult> {
    try {
      console.log(`Sending invoice ${invoiceId} to ${email}`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        data: { id: `invoice_email_${Date.now()}` },
        messageId: `msg_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: undefined,
        messageId: undefined
      };
    }
  },

  async sendOffer({ email, offerId }: { email: string; offerId: string }): Promise<EmailResult> {
    try {
      console.log(`Sending offer ${offerId} to ${email}`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        data: { id: `offer_email_${Date.now()}` },
        messageId: `msg_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: undefined,
        messageId: undefined
      };
    }
  }
};
