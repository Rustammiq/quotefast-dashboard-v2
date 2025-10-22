/* eslint-disable no-console */
/* eslint-disable no-console */
/* Simplified email service voor QuoteFast */

// Removed problematic logger import that was causing recursive import

// Base email template component
const EmailTemplate = ({ 
  theme = 'light', 
  logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  companyName = 'QuoteFast',
  children 
}: { 
  theme?: 'light' | 'dark'
  logoUrl?: string 
  companyName?: string 
  children: React.ReactNode 
}) => {
  const bgColor = theme === 'dark' ? '#0f172a' : '#ffffff'
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b'
  const borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'
  const accentColor = '#8B5CF6'

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.5',
      color: textColor,
      backgroundColor: bgColor,
      margin: '0 auto',
      padding: 0,
      width: '100%',
      maxWidth: '600px'
    }}>
      {/* Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${accentColor} 0%, #a855f7 100%)`,
        padding: '2rem',
        textAlign: 'center' as const,
        borderRadius: '8px 8px 0 0'
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={logoUrl} 
          alt={companyName}
          style={{ 
            height: '40px', 
            width: 'auto',
            marginBottom: '1rem'
          }}
        />
        <h1 style={{ 
          color: '#ffffff', 
          margin: 0, 
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {companyName}
        </h1>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '2rem',
        backgroundColor: bgColor,
        borderRadius: '0 0 8px 8px',
        border: `1px solid ${borderColor}`,
        borderTop: 'none'
      }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '1rem 2rem',
        backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
        textAlign: 'center' as const,
        fontSize: '0.875rem',
        color: theme === 'dark' ? '#94a3b8' : '#64748b',
        border: `1px solid ${borderColor}`,
        borderTop: 'none',
        borderRadius: '0 0 8px 8px'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 {companyName}. Alle rechten voorbehouden.
        </p>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Deze e-mail is automatisch gegenereerd. Reageer niet op dit bericht.
        </p>
      </div>
    </div>
  )
}

// Welcome Email Component
export const WelcomeEmail = ({
  name,
  email = 'user@example.com',
  companyName = 'QuoteFast'
}: {
  name: string
  email?: string
  companyName?: string
}) => {
  return (
    <EmailTemplate companyName={companyName}>
      <h2 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>
        Welkom bij {companyName}, {name}!
      </h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        Bedankt dat je je hebt aangemeld voor {companyName}. We zijn verheugd je aan boord te hebben!
      </p>
      <p style={{ margin: '0 0 1rem 0' }}>
        Je account is succesvol aangemaakt en je kunt nu beginnen met het gebruik van onze AI-gestuurde offerte software.
      </p>
      <div style={{ 
        backgroundColor: '#f1f5f9',
        padding: '1rem',
        borderRadius: '6px',
        margin: '1rem 0',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
          Volgende stappen:
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Vul je bedrijfsprofiel aan</li>
          <li>Maak je eerste offerte</li>
          <li>Stel je teamleden uit</li>
        </ul>
      </div>
      <div style={{ textAlign: 'center' as const, margin: '2rem 0' }}>
        <a 
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`}
          style={{
            display: 'inline-block',
            backgroundColor: '#8B5CF6',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Ga naar Dashboard
        </a>
      </div>
    </EmailTemplate>
  )
}

// Offer Email Component
export const OfferEmail = ({ 
  recipientName,
  offerTitle,
  offerAmount,
  companyName = 'QuoteFast',
  offerUrl
}: { 
  recipientName: string
  offerTitle: string
  offerAmount: number
  companyName?: string
  offerUrl: string
}) => {
  return (
    <EmailTemplate companyName={companyName}>
      <h2 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>
        Nieuwe offerte: {offerTitle}
      </h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        Beste {recipientName},
      </p>
      <p style={{ margin: '0 0 1rem 0' }}>
        We hebben een nieuwe offerte voor je voorbereid. Hier zijn de details:
      </p>
      <div style={{ 
        backgroundColor: '#f1f5f9',
        padding: '1rem',
        borderRadius: '6px',
        margin: '1rem 0',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
          Offerte Details:
        </h3>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong>Titel:</strong> {offerTitle}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Bedrag:</strong> €{offerAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div style={{ textAlign: 'center' as const, margin: '2rem 0' }}>
        <a 
          href={offerUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#8B5CF6',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Bekijk Offerte
        </a>
      </div>
    </EmailTemplate>
  )
}

// Invoice Email Component
export const InvoiceEmail = ({ 
  recipientName,
  invoiceNumber,
  invoiceAmount,
  dueDate,
  companyName = 'QuoteFast',
  invoiceUrl
}: { 
  recipientName: string
  invoiceNumber: string
  invoiceAmount: number
  dueDate: string
  companyName?: string
  invoiceUrl: string
}) => {
  return (
    <EmailTemplate companyName={companyName}>
      <h2 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>
        Factuur #{invoiceNumber}
      </h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        Beste {recipientName},
      </p>
      <p style={{ margin: '0 0 1rem 0' }}>
        Hierbij ontvang je factuur #{invoiceNumber} voor de geleverde diensten.
      </p>
      <div style={{ 
        backgroundColor: '#f1f5f9',
        padding: '1rem',
        borderRadius: '6px',
        margin: '1rem 0',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
          Factuur Details:
        </h3>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong>Factuurnummer:</strong> {invoiceNumber}
        </p>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong>Bedrag:</strong> €{invoiceAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Vervaldatum:</strong> {dueDate}
        </p>
      </div>
      <div style={{ textAlign: 'center' as const, margin: '2rem 0' }}>
        <a 
          href={invoiceUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#8B5CF6',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Bekijk Factuur
        </a>
      </div>
    </EmailTemplate>
  )
}

// Team Invite Email Component
export const TeamInviteEmail = ({ 
  recipientName,
  inviterName,
  companyName = 'QuoteFast',
  inviteUrl
}: { 
  recipientName: string
  inviterName: string
  companyName?: string
  inviteUrl: string
}) => {
  return (
    <EmailTemplate companyName={companyName}>
      <h2 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>
        Uitnodiging voor {companyName}
      </h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        Beste {recipientName},
      </p>
      <p style={{ margin: '0 0 1rem 0' }}>
        {inviterName} heeft je uitgenodigd om lid te worden van het {companyName} team.
      </p>
      <p style={{ margin: '0 0 1rem 0' }}>
        Klik op de onderstaande knop om je account aan te maken en deel te nemen aan het team.
      </p>
      <div style={{ textAlign: 'center' as const, margin: '2rem 0' }}>
        <a 
          href={inviteUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#8B5CF6',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Accepteer Uitnodiging
        </a>
      </div>
    </EmailTemplate>
  )
}

// Password Reset Email Component
export const PasswordResetEmail = ({ 
  recipientName,
  resetUrl,
  companyName = 'QuoteFast'
}: { 
  recipientName: string
  resetUrl: string
  companyName?: string
}) => {
  return (
    <EmailTemplate companyName={companyName}>
      <h2 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>
        Wachtwoord Reset
      </h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        Beste {recipientName},
      </p>
      <p style={{ margin: '0 0 1rem 0' }}>
        Je hebt een wachtwoord reset aangevraagd voor je {companyName} account.
      </p>
      <p style={{ margin: '0 0 1rem 0' }}>
        Klik op de onderstaande knop om je wachtwoord opnieuw in te stellen. Deze link is 24 uur geldig.
      </p>
      <div style={{ textAlign: 'center' as const, margin: '2rem 0' }}>
        <a 
          href={resetUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#8B5CF6',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Reset Wachtwoord
        </a>
      </div>
      <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
        Als je deze aanvraag niet hebt gedaan, kun je deze e-mail negeren.
      </p>
    </EmailTemplate>
  )
}

// Newsletter Email Component
export const NewsletterEmail = ({ 
  recipientName,
  companyName = 'QuoteFast',
  newsletterContent
}: { 
  recipientName: string
  companyName?: string
  newsletterContent: string
}) => {
  return (
    <EmailTemplate companyName={companyName}>
      <h2 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>
        Nieuwsbrief Update
      </h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        Beste {recipientName},
      </p>
      <div style={{ 
        backgroundColor: '#f1f5f9',
        padding: '1rem',
        borderRadius: '6px',
        margin: '1rem 0',
        border: '1px solid #e2e8f0'
      }}>
        <div dangerouslySetInnerHTML={{ __html: newsletterContent }} />
      </div>
      <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
        Je ontvangt deze e-mail omdat je bent aangemeld voor onze nieuwsbrief. 
        <a href="#" style={{ color: '#8B5CF6' }}>Afmelden</a>
      </p>
    </EmailTemplate>
  )
}

// Email utilities object
export const emailUtils = {
  sendWelcome: async ({ email, name }: { email: string; name: string }) => {
    try {
      const emailComponent = WelcomeEmail({ name })
      const result = await sendEmail(email, `Welkom bij QuoteFast, ${name}!`, emailComponent)
      return result
    } catch (error) {
      console.error('Welcome email error:', error)
      return { error: 'Failed to send welcome email' }
    }
  },

  sendOffer: async ({ email, name, offerData }: { email: string; name: string; offerData: any }) => {
    try {
      const emailComponent = OfferEmail({
        recipientName: name,
        offerTitle: offerData.title || 'Offerte',
        offerAmount: offerData.amount || 0,
        offerUrl: offerData.url || '#'
      })
      const result = await sendEmail(email, `Je offerte van QuoteFast`, emailComponent)
      return result
    } catch (error) {
      console.error('Offer email error:', error)
      return { error: 'Failed to send offer email' }
    }
  }
}

// Simplified email service functions
export const sendEmail = async (to: string, subject: string, react: React.ReactNode, options: any = {}) => {
  try {
    // Simplified email sending - just log for now
    console.log('Email would be sent to:', to)
    console.log('Subject:', subject)
    console.log('Options:', options)

    return { success: true, messageId: 'mock-' + Date.now(), data: { id: 'mock-' + Date.now() } }
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}