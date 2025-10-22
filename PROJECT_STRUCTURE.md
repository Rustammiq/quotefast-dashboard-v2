# QuoteFast Dashboard - Project Structure

## 📁 Directory Organization

### `/app/` - Next.js App Router
- **API Routes**: `/api/` - Backend API endpoints
- **Pages**: Dashboard pages, auth pages, public pages
- **Components**: Page-specific components

### `/components/` - Reusable Components
- **`/ui/`** - Base UI components (buttons, cards, inputs)
- **`/forms/`** - Form components and AI assistants
- **`/layout/`** - Layout components (headers, footers, error boundaries)
- **`/modals/`** - Modal and dialog components
- **`/charts/`** - Data visualization components
- **`/dashboard/`** - Dashboard-specific components

### `/lib/` - Core Library
- **`/ai/`** - AI services (Gemini, GLM, personalization)
- **`/auth/`** - Authentication services
- **`/email/`** - Email templates and services
- **`/analytics/`** - Performance monitoring and analytics
- **`/validation/`** - Error handling and validation
- **`/supabase/`** - Database client and utilities
- **`/inngest/`** - Background job processing

### `/types/` - TypeScript Definitions
- **`/api/`** - API response types
- **`/ui/`** - UI component types
- **`/forms/`** - Form validation types

### `/hooks/` - Custom React Hooks
- **`/api/`** - API-related hooks
- **`/ui/`** - UI interaction hooks
- **`/validation/`** - Form validation hooks

### `/utils/` - Utility Functions
- **`/format/`** - Data formatting utilities
- **`/helpers/`** - General helper functions
- **`/validation/`** - Validation utilities

### `/contexts/` - React Context Providers
- Authentication, theme, AI personalization contexts

### `/styles/` - Styling
- Global CSS, component styles, utilities

### `/public/` - Static Assets
- Images, icons, fonts, manifest files

### `/docs/` - Documentation
- **`/guides/`** - Setup and implementation guides
- **`/api/`** - API documentation
- **`/components/`** - Component documentation

### `/tests/` - Testing
- **`/unit/`** - Unit tests
- **`/integration/`** - Integration tests
- **`/e2e/`** - End-to-end tests

### `/scripts/` - Build and Deployment
- **`/build/`** - Build scripts
- **`/deploy/`** - Deployment scripts
- **`/dev/`** - Development scripts

## 🎯 Benefits of This Structure

1. **Clear Separation**: Each directory has a specific purpose
2. **Easy Navigation**: Developers can quickly find what they need
3. **Scalable**: Easy to add new features without cluttering
4. **Maintainable**: Related files are grouped together
5. **Type Safety**: Centralized type definitions
6. **Reusability**: Components and utilities are easily shared

## 📝 Import Guidelines

### Use Barrel Exports
```typescript
// ✅ Good - Use index files
import { geminiService, authService } from '@/lib';
import { ErrorBoundary, PricingSection } from '@/components/layout';

// ❌ Avoid - Direct file imports
import { geminiService } from '@/lib/ai/gemini-service';
```

### Path Aliases
- `@/` - Root directory
- `@/components/` - Components directory
- `@/lib/` - Library directory
- `@/types/` - Types directory
- `@/utils/` - Utils directory

## 🔄 Migration Notes

- All existing imports should continue to work
- New code should use the organized structure
- Gradually migrate old imports to use barrel exports
- Update imports when refactoring components
