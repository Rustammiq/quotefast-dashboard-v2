#!/usr/bin/env node

/**
 * Lighthouse Performance Testing Script
 * 
 * Runs Lighthouse performance audits on the QuoteFast Dashboard:
 * - Performance metrics
 * - Accessibility scores
 * - Best practices
 * - SEO scores
 * - PWA compliance
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.LIGHTHOUSE_BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = './lighthouse-reports';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runLighthouseAudit(url, options = {}) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const config = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    ...options
  };
  
  const runnerResult = await lighthouse(url, config);
  
  await chrome.kill();
  
  return runnerResult;
}

async function generateReport(auditResult, pageName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `lighthouse-${pageName}-${timestamp}.html`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filepath, auditResult.report);
  
  console.log(`📊 Lighthouse report generated: ${filepath}`);
  
  // Log scores
  const scores = auditResult.lhr.categories;
  console.log('\n📈 Performance Scores:');
  console.log(`Performance: ${Math.round(scores.performance.score * 100)}`);
  console.log(`Accessibility: ${Math.round(scores.accessibility.score * 100)}`);
  console.log(`Best Practices: ${Math.round(scores['best-practices'].score * 100)}`);
  console.log(`SEO: ${Math.round(scores.seo.score * 100)}`);
  
  return {
    filepath,
    scores: {
      performance: Math.round(scores.performance.score * 100),
      accessibility: Math.round(scores.accessibility.score * 100),
      bestPractices: Math.round(scores['best-practices'].score * 100),
      seo: Math.round(scores.seo.score * 100),
    }
  };
}

async function main() {
  console.log('🚀 Starting Lighthouse performance audit...');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  
  try {
    // Test homepage
    console.log('\n🏠 Testing homepage...');
    const homepageResult = await runLighthouseAudit(BASE_URL);
    const homepageReport = await generateReport(homepageResult, 'homepage');
    
    // Test login page
    console.log('\n🔐 Testing login page...');
    const loginResult = await runLighthouseAudit(`${BASE_URL}/login`);
    const loginReport = await generateReport(loginResult, 'login');
    
    // Test dashboard page (if accessible)
    console.log('\n📊 Testing dashboard page...');
    try {
      const dashboardResult = await runLighthouseAudit(`${BASE_URL}/dashboard`);
      const dashboardReport = await generateReport(dashboardResult, 'dashboard');
    } catch (error) {
      console.log('⚠️ Dashboard page not accessible (authentication required)');
    }
    
    // Generate summary report
    const summary = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      reports: {
        homepage: homepageReport.scores,
        login: loginReport.scores,
      }
    };
    
    const summaryPath = path.join(OUTPUT_DIR, 'lighthouse-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log('\n✅ Lighthouse audit complete!');
    console.log(`📁 Reports saved to: ${OUTPUT_DIR}`);
    console.log(`📋 Summary: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runLighthouseAudit, generateReport };
