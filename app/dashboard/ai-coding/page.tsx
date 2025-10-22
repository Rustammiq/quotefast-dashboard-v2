// app/dashboard/ai-coding/page.tsx

import { Metadata } from 'next';
import GLMCodingAssistant from '@/components/forms/GLMCodingAssistant';
import { Code, Sparkles, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Coding Assistant | QuoteFast Dashboard',
  description: 'GLM 4.6 powered coding assistant for code generation, refactoring, debugging, and more.',
};

export default function AICodingPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl glass-card hover:shadow-lg transition-all duration-300">
            <Code className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI Coding Assistant
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Powered by GLM 4.6 - Your intelligent coding companion</span>
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-primary/20">
          <p className="text-foreground/80 text-sm leading-relaxed">
            Gebruik AI om code te genereren, refactoren, debuggen en optimaliseren.
            Beschikbare acties: <strong>Generate</strong>, <strong>Refactor</strong>, <strong>Explain</strong>,
            <strong>Debug</strong>, <strong>Optimize</strong> en <strong>Test Generation</strong>.
          </p>
        </div>
      </div>

      <GLMCodingAssistant />
    </div>
  );
}