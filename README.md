# 🚀 QuoteFast Dashboard v2

Een moderne, geoptimaliseerde SaaS platform voor offerte en factuur beheer met krachtige AI-integratie.

## ✨ Features

- 🧠 **AI-Powered**: Google Gemini AI voor intelligente content generatie
- 📊 **Neural Network Dashboard**: Interactieve hersenactiviteit visualisatie
- 💼 **Quote Management**: Volledig offerte beheer systeem
- 🧾 **Invoice System**: Geavanceerd facturatie systeem
- 🎨 **Modern UI**: Responsive design met Framer Motion animaties
- 🔐 **Secure Auth**: Supabase authenticatie en autorisatie
- ⚡ **Performance**: Geoptimaliseerd voor snelheid en efficiency

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **AI Integration**: Google Gemini AI 2.5 Pro
- **Styling**: Tailwind CSS, CSS Modules, Framer Motion
- **Deployment**: Ready for Vercel, Netlify, Hugging Face Spaces

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Rustammiq/quotefast-dashboard-v2.git
cd quotefast-dashboard-v2

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your Supabase and API keys to .env.local

# Run development server
npm run dev
```

## 📁 Project Structure

```
app/                    # Next.js 13+ app directory
├── api/               # API routes
├── auth/              # Authentication pages
├── dashboard/         # Dashboard pages en componenten
└── components/        # Herbruikbare componenten

components/            # Shared componenten
├── ui/               # Basis UI componenten
└── dashboard/        # Dashboard specifieke componenten

lib/                  # Utilities en services
├── supabase/         # Supabase client en utilities
├── gemini-service.ts # AI integration
└── api-service.ts    # API calls

types/                # TypeScript type definities
```

## 🧹 Recent Cleanup (v2)

- ✅ **47+ bestanden verwijderd** (duplicaten, scripts, docs)
- ✅ **Componenten geconsolideerd** (Button, Logger, NavLink)
- ✅ **TypeScript geoptimaliseerd** (ES2015 + downlevelIteration)
- ✅ **Mock data gesynchroniseerd** met type definities
- ✅ **Neural Network Dashboard** toegevoegd
- 📊 **~365KB ruimtebesparing**, schonere codebase

## 🔧 Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Start production
npm start
```

## 📊 Performance

- **LCP**: < 2.5s (Large screens)
- **FID**: < 100ms  
- **CLS**: < 0.1
- **Bundle Size**: Geoptimaliseerd voor snelle loading

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) voor het geweldige framework
- [Supabase](https://supabase.com/) voor de backend services
- [Tailwind CSS](https://tailwindcss.com/) voor de styling
- [Framer Motion](https://www.framer.com/motion/) voor de animaties
- [Google Gemini](https://ai.google.dev/) voor de AI integratie

---

**QuoteFast Dashboard v2** - Gemaakt met ❤️ voor moderne bedrijven