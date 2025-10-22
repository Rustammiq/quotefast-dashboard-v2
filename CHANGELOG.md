# Changelog

Alle belangrijke wijzigingen aan dit project worden gedocumenteerd in dit bestand.

## [2.0.0] - 2024-01-22

### 🧹 Major Cleanup & Optimization

#### Added
- 🧠 **Neural Network Dashboard** - Interactieve hersenactiviteit visualisatie
- 📊 **Brain Activity Widget** - Real-time AI processing visualisatie
- 🎨 **Enhanced UI Components** - Verbeterde Button componenten met alle varianten
- 📝 **Comprehensive README** - Uitgebreide documentatie en setup instructies
- 🔧 **TypeScript Optimization** - ES2015 target met downlevelIteration

#### Changed
- 🔄 **Consolidated Components** - Button, Logger, NavLink componenten geconsolideerd
- 📁 **Project Structure** - Opgeschoonde directory structuur
- 🎯 **Mock Data** - Gesynchroniseerd met TypeScript interfaces
- ⚡ **Performance** - Geoptimaliseerde build en loading times

#### Removed
- 🗑️ **47+ Redundant Files** - Duplicaten, scripts, en documentatie verwijderd
- 📂 **Empty Directories** - Lege directories opgeruimd
- 🔧 **Unused Scripts** - 37+ redundante setup en fix scripts
- 📚 **Redundant Docs** - 15+ overbodige documentatie bestanden

#### Fixed
- 🐛 **TypeScript Errors** - Alle type errors opgelost
- 🔧 **ESLint Warnings** - Console statements en hook dependencies gefixt
- 📦 **Build Issues** - Webpack module problemen opgelost
- 🎨 **Component Variants** - Button varianten uitgebreid (outline, secondary, ghost, link)

#### Technical Details
- **Files Removed**: 47+ bestanden
- **Space Saved**: ~365KB
- **TypeScript**: Geoptimaliseerd voor ES2015
- **Build Time**: Verbeterd door minder bestanden
- **Maintainability**: Aanzienlijk verbeterd

### Migration Guide

#### For Developers
- Update imports van `@/components/ui/button` naar `@/lib/Button`
- Update logger imports naar `@/utils/logger`
- Button varianten zijn nu uitgebreid met `outline`, `secondary`, `ghost`, `link`

#### For Users
- Geen breaking changes voor eindgebruikers
- Verbeterde performance en stabiliteit
- Nieuwe neural network dashboard beschikbaar

---

## [1.0.0] - 2024-01-15

### Initial Release
- 🚀 Eerste release van QuoteFast Dashboard
- 💼 Basis offerte en factuur beheer functionaliteit
- 🤖 Google Gemini AI integratie
- 🔐 Supabase authenticatie
- 📱 Responsive design