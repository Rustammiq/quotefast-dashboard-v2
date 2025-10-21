#!/usr/bin/env node

/**
 * Supabase Setup Script
 * Helpt met het configureren van Supabase voor lokale ontwikkeling
 */

const fs = require('fs');
const path = require('path');

function createEnvFile() {
  const envPath = '.env.local';
  
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file bestaat al');
    return;
  }

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qgyboabomydquodygomq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=JE_ECHTE_ANON_KEY_HIER
SUPABASE_SERVICE_ROLE_KEY=JE_SERVICE_ROLE_KEY_HIER

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Google Gemini Configuration (optioneel)
GOOGLE_GEMINI_API_KEY=je_gemini_api_key_hier

# Stripe Configuration (optioneel)
STRIPE_SECRET_KEY=sk_test_je_stripe_secret_key_hier
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_je_stripe_publishable_key_hier
STRIPE_WEBHOOK_SECRET=whsec_je_webhook_secret_hier
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file aangemaakt');
}

function checkSupabaseConfig() {
  console.log('🔍 Controleer Supabase configuratie...');
  
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file niet gevonden');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('JE_ECHTE_ANON_KEY_HIER')) {
    console.log('❌ Supabase anon key is nog niet ingesteld');
    console.log('📋 Volg deze stappen:');
    console.log('1. Ga naar: https://supabase.com/dashboard/project/qgyboabomydquodygomq');
    console.log('2. Ga naar Settings > API');
    console.log('3. Kopieer de "anon public" key');
    console.log('4. Vervang JE_ECHTE_ANON_KEY_HIER in .env.local');
    return false;
  }

  console.log('✅ Supabase configuratie lijkt correct');
  return true;
}

function showSupabaseInstructions() {
  console.log('\n🚀 Supabase Setup Instructies');
  console.log('==============================');
  console.log('');
  console.log('1. Ga naar je Supabase project:');
  console.log('   https://supabase.com/dashboard/project/qgyboabomydquodygomq');
  console.log('');
  console.log('2. Ga naar Settings > API');
  console.log('');
  console.log('3. Kopieer de volgende keys:');
  console.log('   - anon public (voor NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  console.log('   - service_role (voor SUPABASE_SERVICE_ROLE_KEY)');
  console.log('');
  console.log('4. Vervang de placeholder values in .env.local');
  console.log('');
  console.log('5. Herstart de development server:');
  console.log('   npm run dev');
  console.log('');
  console.log('6. Test de login functionaliteit');
  console.log('');
}

function checkCorsSettings() {
  console.log('\n🌐 CORS Configuratie Check');
  console.log('===========================');
  console.log('');
  console.log('Als je nog steeds CORS errors krijgt:');
  console.log('');
  console.log('1. Ga naar Supabase Dashboard > Settings > API');
  console.log('2. Voeg toe aan "Additional Redirect URLs":');
  console.log('   - http://localhost:3000');
  console.log('   - http://localhost:3000/auth/callback');
  console.log('');
  console.log('3. Voeg toe aan "Site URL":');
  console.log('   - http://localhost:3000');
  console.log('');
  console.log('4. Sla de wijzigingen op');
  console.log('');
}

function main() {
  console.log('🔧 Supabase Setup Script');
  console.log('========================\n');
  
  createEnvFile();
  
  const isConfigured = checkSupabaseConfig();
  
  if (!isConfigured) {
    showSupabaseInstructions();
    checkCorsSettings();
  } else {
    console.log('\n✅ Supabase is correct geconfigureerd!');
    console.log('🚀 Je kunt nu inloggen op http://localhost:3000/login');
  }
}

if (require.main === module) {
  main();
}

module.exports = { createEnvFile, checkSupabaseConfig, showSupabaseInstructions };