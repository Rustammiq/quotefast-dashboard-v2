// lib/aiPersonalization.ts

import { OnboardingData } from './onboarding'

export interface PersonalizedTemplate {
  id: string
  name: string
  description: string
  industry: string
  category: string
  estimatedTime: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
}

export interface SuggestedWorkflow {
  id: string
  name: string
  description: string
  triggers: string[]
  actions: string[]
  estimatedSavings: string
  setupTime: string
}

export interface IntegrationSuggestion {
  id: string
  name: string
  description: string
  category: string
  popularity: number
  setupComplexity: 'easy' | 'medium' | 'hard'
  benefits: string[]
}

export function getPersonalizedTemplates(onboardingData: OnboardingData): PersonalizedTemplate[] {
  const allTemplates: PersonalizedTemplate[] = [
    // IT Templates
    {
      id: 'it-software-dev',
      name: 'Software Development Offerte',
      description: 'Complete offerte voor software ontwikkeling projecten',
      industry: 'it',
      category: 'development',
      estimatedTime: '15 min',
      complexity: 'intermediate'
    },
    {
      id: 'it-consulting',
      name: 'IT Consulting Offerte',
      description: 'Standaard IT consulting en advies offerte',
      industry: 'it',
      category: 'consulting',
      estimatedTime: '10 min',
      complexity: 'beginner'
    },
    // Bouw Templates
    {
      id: 'bouw-renovatie',
      name: 'Renovatie Project Offerte',
      description: 'Uitgebreide offerte voor renovatie projecten',
      industry: 'bouw',
      category: 'renovation',
      estimatedTime: '25 min',
      complexity: 'advanced'
    },
    {
      id: 'bouw-nieuwbouw',
      name: 'Nieuwbouw Offerte',
      description: 'Complete nieuwbouw project offerte',
      industry: 'bouw',
      category: 'construction',
      estimatedTime: '30 min',
      complexity: 'advanced'
    },
    // Consultancy Templates
    {
      id: 'consultancy-strategy',
      name: 'Strategisch Advies Offerte',
      description: 'Business strategy en advies offerte',
      industry: 'consultancy',
      category: 'strategy',
      estimatedTime: '20 min',
      complexity: 'intermediate'
    },
    // E-commerce Templates
    {
      id: 'ecommerce-webshop',
      name: 'Webshop Development Offerte',
      description: 'E-commerce platform ontwikkeling offerte',
      industry: 'ecommerce',
      category: 'development',
      estimatedTime: '35 min',
      complexity: 'advanced'
    }
  ]

  // Filter templates based on industry and team size
  return allTemplates.filter(template => {
    const industryMatch = template.industry === onboardingData.industry
    const teamSizeMatch = onboardingData.teamSize === '1-5' ? 
      template.complexity === 'beginner' : 
      onboardingData.teamSize === '6-20' ? 
        ['beginner', 'intermediate'].includes(template.complexity) :
        true // For larger teams, show all templates
    
    return industryMatch && teamSizeMatch
  })
}

export function getSuggestedWorkflows(onboardingData: OnboardingData): SuggestedWorkflow[] {
  const allWorkflows: SuggestedWorkflow[] = [
    {
      id: 'auto-invoice',
      name: 'Automatische Factuur Generatie',
      description: 'Genereer automatisch facturen na goedgekeurde offertes',
      triggers: ['Offerte goedgekeurd', 'Project voltooid'],
      actions: ['Factuur genereren', 'E-mail versturen', 'Boekhouding updaten'],
      estimatedSavings: '2-3 uur per week',
      setupTime: '15 min'
    },
    {
      id: 'follow-up-reminder',
      name: 'Follow-up Herinneringen',
      description: 'Automatische herinneringen voor openstaande offertes',
      triggers: ['Offerte verstuurd', 'Geen reactie na 3 dagen'],
      actions: ['Herinnering e-mail', 'Telefoon reminder', 'Status update'],
      estimatedSavings: '1-2 uur per week',
      setupTime: '10 min'
    },
    {
      id: 'client-onboarding',
      name: 'Klant Onboarding Workflow',
      description: 'Automatiseer het onboarding proces voor nieuwe klanten',
      triggers: ['Nieuwe klant toegevoegd', 'Eerste project gestart'],
      actions: ['Welkomst e-mail', 'Contract genereren', 'Project setup'],
      estimatedSavings: '3-4 uur per klant',
      setupTime: '20 min'
    },
    {
      id: 'project-status-updates',
      name: 'Project Status Updates',
      description: 'Automatische status updates naar klanten',
      triggers: ['Project milestone bereikt', 'Wekelijkse update'],
      actions: ['Status rapport genereren', 'Klant notificatie', 'Dashboard update'],
      estimatedSavings: '1 uur per project',
      setupTime: '12 min'
    }
  ]

  // Filter workflows based on automation level and usage goals
  return allWorkflows.filter(workflow => {
    const automationMatch = onboardingData.workflowPreferences.automationLevel === 'maximum' ||
      (onboardingData.workflowPreferences.automationLevel === 'gemiddeld' && 
       ['auto-invoice', 'follow-up-reminder'].includes(workflow.id)) ||
      (onboardingData.workflowPreferences.automationLevel === 'minimaal' && 
       workflow.id === 'follow-up-reminder')
    
    const usageMatch = onboardingData.usageGoals.some(goal => {
      if (goal === 'offertes' && workflow.id === 'follow-up-reminder') return true
      if (goal === 'factureren' && workflow.id === 'auto-invoice') return true
      if (goal === 'projectmanagement' && workflow.id === 'project-status-updates') return true
      if (goal === 'klantbeheer' && workflow.id === 'client-onboarding') return true
      return false
    })
    
    return automationMatch && usageMatch
  })
}

export function getRelevantIntegrations(onboardingData: OnboardingData): IntegrationSuggestion[] {
  const allIntegrations: IntegrationSuggestion[] = [
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'E-mail marketing en automatisering',
      category: 'email',
      popularity: 95,
      setupComplexity: 'easy',
      benefits: ['E-mail campagnes', 'Automatisering', 'Analytics']
    },
    {
      id: 'exact-online',
      name: 'Exact Online',
      description: 'Nederlandse boekhoudsoftware integratie',
      category: 'boekhouding',
      popularity: 85,
      setupComplexity: 'medium',
      benefits: ['Automatische facturen', 'Debiteuren beheer', 'Rapportage']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'All-in-one CRM en marketing platform',
      category: 'crm',
      popularity: 90,
      setupComplexity: 'medium',
      benefits: ['Lead management', 'Sales pipeline', 'Marketing automation']
    },
    {
      id: 'monday',
      name: 'Monday.com',
      description: 'Project management en team collaboration',
      category: 'projectmanagement',
      popularity: 80,
      setupComplexity: 'easy',
      benefits: ['Project tracking', 'Team collaboration', 'Workflow automation']
    },
    {
      id: 'mollie',
      name: 'Mollie',
      description: 'Nederlandse betalingsprovider',
      category: 'betalingen',
      popularity: 75,
      setupComplexity: 'easy',
      benefits: ['Online betalingen', 'Factuur betalingen', 'Multi-currency']
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Kalender integratie voor afspraken',
      category: 'calendar',
      popularity: 98,
      setupComplexity: 'easy',
      benefits: ['Afspraken synchronisatie', 'Automatische reminders', 'Team planning']
    }
  ]

  // Filter integrations based on integration needs and industry
  return allIntegrations.filter(integration => {
    const needsMatch = onboardingData.workflowPreferences.integrationNeeds.includes(integration.category)
    const industryRelevance = onboardingData.industry === 'it' ? 
      ['email', 'crm', 'projectmanagement'].includes(integration.category) :
      onboardingData.industry === 'bouw' ?
        ['boekhouding', 'betalingen', 'calendar'].includes(integration.category) :
        true // For other industries, show all relevant integrations
    
    return needsMatch && industryRelevance
  }).sort((a, b) => b.popularity - a.popularity)
}

export function generateContextualHelp(feature: string, onboardingData: OnboardingData): string {
  const helpTexts: Record<string, Record<string, string>> = {
    'offertes': {
      'it': `Voor ${onboardingData.companyName} in de IT sector raden we aan om te beginnen met onze software development templates. Deze zijn geoptimaliseerd voor ${onboardingData.teamSize} teams.`,
      'bouw': `Als bouwbedrijf met ${onboardingData.teamSize} medewerkers kun je profiteren van onze gespecialiseerde renovatie en nieuwbouw templates.`,
      'consultancy': `Voor consultancy werk hebben we strategische advies templates die perfect passen bij je ${onboardingData.workflowPreferences.automationLevel} automatisering niveau.`,
      'default': `Gebaseerd op je ${onboardingData.industry} branche hebben we templates die passen bij je ${onboardingData.teamSize} team.`
    },
    'factureren': {
      'it': `IT projecten hebben vaak complexe facturatie. Met je ${onboardingData.workflowPreferences.automationLevel} automatisering kun je tijd besparen op herhalende facturen.`,
      'bouw': `Bouwprojecten hebben specifieke facturatie behoeften. Onze templates ondersteunen progressie facturen en materiaal kosten.`,
      'default': `Voor ${onboardingData.companyName} hebben we factuur workflows die passen bij je ${onboardingData.workflowPreferences.reportingFrequency} rapportage voorkeur.`
    },
    'dashboard': {
      'default': `Welkom ${onboardingData.companyName}! Je dashboard is geoptimaliseerd voor ${onboardingData.industry} bedrijven. We tonen metrics die relevant zijn voor je ${onboardingData.teamSize} team.`
    }
  }

  const featureHelp = helpTexts[feature] || helpTexts['dashboard']
  return featureHelp[onboardingData.industry] || featureHelp['default'] || ''
}

export function getPersonalizedQuickActions(onboardingData: OnboardingData): Array<{
  id: string
  label: string
  description: string
  href: string
  icon: string
}> {
  const allActions = [
    {
      id: 'create-offer',
      label: 'Nieuwe Offerte',
      description: 'Maak een nieuwe offerte aan',
      href: '/dashboard/offertes/new',
      icon: 'FileText'
    },
    {
      id: 'create-invoice',
      label: 'Nieuwe Factuur',
      description: 'Genereer een nieuwe factuur',
      href: '/dashboard/facturatie/new',
      icon: 'Receipt'
    },
    {
      id: 'add-client',
      label: 'Nieuwe Klant',
      description: 'Voeg een nieuwe klant toe',
      href: '/dashboard/klanten/new',
      icon: 'UserPlus'
    },
    {
      id: 'create-project',
      label: 'Nieuw Project',
      description: 'Start een nieuw project',
      href: '/dashboard/projects/new',
      icon: 'FolderPlus'
    },
    {
      id: 'ai-generate',
      label: 'AI Offerte Generator',
      description: 'Laat AI een offerte genereren',
      href: '/dashboard/ai/offerte',
      icon: 'Zap'
    },
    {
      id: 'reports',
      label: 'Rapportages',
      description: 'Bekijk je bedrijfsrapportages',
      href: '/dashboard/rapportages',
      icon: 'BarChart'
    }
  ]

  // Filter actions based on usage goals
  return allActions.filter(action => {
    if (action.id === 'create-offer' && onboardingData.usageGoals.includes('offertes')) return true
    if (action.id === 'create-invoice' && onboardingData.usageGoals.includes('factureren')) return true
    if (action.id === 'add-client' && onboardingData.usageGoals.includes('crm')) return true
    if (action.id === 'create-project' && onboardingData.usageGoals.includes('projectmanagement')) return true
    if (action.id === 'ai-generate' && onboardingData.aiFeatureInterests.includes('ai-offerte-generator')) return true
    if (action.id === 'reports' && onboardingData.usageGoals.includes('rapportage')) return true
    return false
  }).slice(0, 4) // Limit to 4 actions
}
