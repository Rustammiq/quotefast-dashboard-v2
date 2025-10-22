// Email templates

export const emailTemplates = {
  welcome: {
    subject: 'Welkom bij QuoteFast!',
    html: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welkom bij QuoteFast, ${name}!</h1>
        <p>Bedankt voor je registratie. Je kunt nu beginnen met het maken van professionele offertes en facturen.</p>
        <p>Veel succes met je bedrijf!</p>
        <p>Het QuoteFast team</p>
      </div>
    `,
    text: (name: string) => `Welkom bij QuoteFast, ${name}!\n\nBedankt voor je registratie. Je kunt nu beginnen met het maken van professionele offertes en facturen.\n\nVeel succes met je bedrijf!\n\nHet QuoteFast team`
  },

  invoice: {
    subject: 'Nieuwe factuur van QuoteFast',
    html: (invoiceNumber: string, amount: number) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Nieuwe factuur: ${invoiceNumber}</h1>
        <p>Bedrag: €${amount.toFixed(2)}</p>
        <p>Log in op je dashboard om de factuur te bekijken en te betalen.</p>
        <p>Het QuoteFast team</p>
      </div>
    `,
    text: (invoiceNumber: string, amount: number) => `Nieuwe factuur: ${invoiceNumber}\n\nBedrag: €${amount.toFixed(2)}\n\nLog in op je dashboard om de factuur te bekijken en te betalen.\n\nHet QuoteFast team`
  },

  offer: {
    subject: 'Nieuwe offerte van QuoteFast',
    html: (offerNumber: string, amount: number) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Nieuwe offerte: ${offerNumber}</h1>
        <p>Bedrag: €${amount.toFixed(2)}</p>
        <p>Log in op je dashboard om de offerte te bekijken.</p>
        <p>Het QuoteFast team</p>
      </div>
    `,
    text: (offerNumber: string, amount: number) => `Nieuwe offerte: ${offerNumber}\n\nBedrag: €${amount.toFixed(2)}\n\nLog in op je dashboard om de offerte te bekijken.\n\nHet QuoteFast team`
  }
};