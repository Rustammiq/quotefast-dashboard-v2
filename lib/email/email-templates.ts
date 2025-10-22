// Email templates for Supabase auth with beautiful HTML design
export const emailTemplates = {
  // Welcome email template
  welcome: (userName: string, confirmUrl: string) => `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welkom bij QuoteFast Dashboard</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .highlight {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 QuoteFast Dashboard</div>
          <h1 class="title">Welkom ${userName}!</h1>
        </div>
        
        <div class="content">
          <p>Bedankt voor het aanmelden bij QuoteFast Dashboard! We zijn blij dat je deel uitmaakt van onze community.</p>
          
          <div class="highlight">
            <strong>📧 Bevestig je e-mailadres</strong><br>
            Klik op de knop hieronder om je account te activeren en toegang te krijgen tot alle functies.
          </div>
          
          <p>Na bevestiging kun je direct aan de slag met:</p>
          <ul>
            <li>✨ AI-gestuurde offerte generatie</li>
            <li>📊 Uitgebreide dashboard analytics</li>
            <li>👥 Klantbeheer systeem</li>
            <li>💰 Facturatie en betalingen</li>
          </ul>
        </div>
        
        <div style="text-align: center;">
          <a href="${confirmUrl}" class="button">Bevestig je account</a>
        </div>
        
        <div class="footer">
          <p>Als je problemen ondervindt, kun je deze link kopiëren en plakken in je browser:</p>
          <p style="word-break: break-all; color: #3b82f6;">${confirmUrl}</p>
          <p>Deze link is 24 uur geldig.</p>
          <p>Met vriendelijke groet,<br>Het QuoteFast Team</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Password reset email template
  passwordReset: (userName: string, resetUrl: string) => `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wachtwoord Reset - QuoteFast Dashboard</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .warning {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
          margin: 20px 0;
        }
        .security-tips {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔐 QuoteFast Dashboard</div>
          <h1 class="title">Wachtwoord Reset</h1>
        </div>
        
        <div class="content">
          <p>Hallo ${userName},</p>
          <p>We hebben een verzoek ontvangen om je wachtwoord te resetten voor je QuoteFast Dashboard account.</p>
          
          <div class="warning">
            <strong>⚠️ Beveiligingswaarschuwing</strong><br>
            Als je dit verzoek niet hebt gedaan, negeer deze e-mail dan. Je account blijft veilig.
          </div>
          
          <p>Klik op de knop hieronder om een nieuw wachtwoord in te stellen:</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Wachtwoord Resetten</a>
        </div>
        
        <div class="security-tips">
          <strong>🛡️ Beveiligingstips:</strong>
          <ul>
            <li>Gebruik een sterk wachtwoord met minimaal 8 tekens</li>
            <li>Combineer letters, cijfers en speciale tekens</li>
            <li>Gebruik geen persoonlijke informatie</li>
            <li>Overweeg het gebruik van een wachtwoordmanager</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Als je problemen ondervindt, kun je deze link kopiëren en plakken in je browser:</p>
          <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
          <p>Deze link is 1 uur geldig voor beveiligingsdoeleinden.</p>
          <p>Met vriendelijke groet,<br>Het QuoteFast Team</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Password change confirmation
  passwordChanged: (userName: string) => `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wachtwoord Gewijzigd - QuoteFast Dashboard</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .success {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #22c55e;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .info-box {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✅ QuoteFast Dashboard</div>
          <h1 class="title">Wachtwoord Succesvol Gewijzigd</h1>
        </div>
        
        <div class="content">
          <p>Hallo ${userName},</p>
          <p>Je wachtwoord is succesvol gewijzigd voor je QuoteFast Dashboard account.</p>
          
          <div class="success">
            <strong>🎉 Wachtwoord Update Voltooid!</strong><br>
            Je account is nu beveiligd met je nieuwe wachtwoord.
          </div>
          
          <div class="info-box">
            <strong>📅 Tijdstip:</strong> ${new Date().toLocaleString('nl-NL')}<br>
            <strong>🌐 IP-adres:</strong> [Wordt automatisch ingevuld]<br>
            <strong>🖥️ Apparaat:</strong> [Wordt automatisch ingevuld]
          </div>
          
          <p>Als je deze wijziging niet hebt aangevraagd, neem dan onmiddellijk contact met ons op via support@quotefast.nl</p>
        </div>
        
        <div class="footer">
          <p>Je account blijft veilig en beveiligd.</p>
          <p>Met vriendelijke groet,<br>Het QuoteFast Team</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Email change confirmation
  emailChanged: (userName: string, newEmail: string, confirmUrl: string) => `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-mailadres Gewijzigd - QuoteFast Dashboard</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .highlight {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📧 QuoteFast Dashboard</div>
          <h1 class="title">E-mailadres Gewijzigd</h1>
        </div>
        
        <div class="content">
          <p>Hallo ${userName},</p>
          <p>Je e-mailadres is gewijzigd naar: <strong>${newEmail}</strong></p>
          
          <div class="highlight">
            <strong>📧 Bevestig je nieuwe e-mailadres</strong><br>
            Klik op de knop hieronder om je nieuwe e-mailadres te bevestigen.
          </div>
          
          <p>Na bevestiging kun je weer volledig gebruikmaken van alle functies van je account.</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${confirmUrl}" class="button">Bevestig E-mailadres</a>
        </div>
        
        <div class="footer">
          <p>Als je problemen ondervindt, kun je deze link kopiëren en plakken in je browser:</p>
          <p style="word-break: break-all; color: #3b82f6;">${confirmUrl}</p>
          <p>Deze link is 24 uur geldig.</p>
          <p>Met vriendelijke groet,<br>Het QuoteFast Team</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Magic link email
  magicLink: (userName: string, loginUrl: string) => `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inloggen - QuoteFast Dashboard</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .magic {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✨ QuoteFast Dashboard</div>
          <h1 class="title">Inloggen zonder Wachtwoord</h1>
        </div>
        
        <div class="content">
          <p>Hallo ${userName},</p>
          <p>Je hebt een inloglink aangevraagd voor je QuoteFast Dashboard account.</p>
          
          <div class="magic">
            <strong>🔗 Magic Link</strong><br>
            Klik op de knop hieronder om direct in te loggen zonder wachtwoord.
          </div>
          
          <p>Deze link is veilig en brengt je direct naar je dashboard.</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${loginUrl}" class="button">Inloggen</a>
        </div>
        
        <div class="footer">
          <p>Als je problemen ondervindt, kun je deze link kopiëren en plakken in je browser:</p>
          <p style="word-break: break-all; color: #3b82f6;">${loginUrl}</p>
          <p>Deze link is 1 uur geldig.</p>
          <p>Met vriendelijke groet,<br>Het QuoteFast Team</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Email template helper functions
export const emailHelpers = {
  // Get template by type
  getTemplate(type: keyof typeof emailTemplates) {
    return emailTemplates[type];
  },

  // Send email using Resend (if configured)
  async sendEmail(to: string, subject: string, html: string) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, email not sent');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'QuoteFast Dashboard <noreply@quotefast.nl>',
          to: [to],
          subject,
          html,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Failed to send email' };
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  // Send welcome email
  async sendWelcomeEmail(email: string, userName: string, confirmUrl: string) {
    const html = emailTemplates.welcome(userName, confirmUrl);
    return await this.sendEmail(
      email,
      'Welkom bij QuoteFast Dashboard! Bevestig je account',
      html
    );
  },

  // Send password reset email
  async sendPasswordResetEmail(email: string, userName: string, resetUrl: string) {
    const html = emailTemplates.passwordReset(userName, resetUrl);
    return await this.sendEmail(
      email,
      'Wachtwoord Reset - QuoteFast Dashboard',
      html
    );
  },

  // Send password changed confirmation
  async sendPasswordChangedEmail(email: string, userName: string) {
    const html = emailTemplates.passwordChanged(userName);
    return await this.sendEmail(
      email,
      'Wachtwoord Succesvol Gewijzigd - QuoteFast Dashboard',
      html
    );
  },

  // Send email change confirmation
  async sendEmailChangedEmail(email: string, userName: string, newEmail: string, confirmUrl: string) {
    const html = emailTemplates.emailChanged(userName, newEmail, confirmUrl);
    return await this.sendEmail(
      email,
      'E-mailadres Gewijzigd - Bevestig je nieuwe e-mailadres',
      html
    );
  },

  // Send magic link email
  async sendMagicLinkEmail(email: string, userName: string, loginUrl: string) {
    const html = emailTemplates.magicLink(userName, loginUrl);
    return await this.sendEmail(
      email,
      'Inloggen zonder Wachtwoord - QuoteFast Dashboard',
      html
    );
  },
};

export default emailTemplates;
