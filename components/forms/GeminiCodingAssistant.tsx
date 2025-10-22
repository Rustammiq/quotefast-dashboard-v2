// components/GeminiCodingAssistant.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Copy, CheckCircle, AlertCircle, Code, Zap, Bug, TrendingUp, TestTube, Brain } from 'lucide-react';

interface GeminiResponse {
  success: boolean;
  data?: string;
  error?: string;
  action: string;
}

type ActionType = 'generate' | 'refactor' | 'explain' | 'debug' | 'optimize' | 'generate-tests' | 'chat';

interface ActionConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  requiresCode?: boolean;
  requiresInstructions?: boolean;
  requiresError?: boolean;
  requiresMessages?: boolean;
}

const actionConfigs: Record<ActionType, ActionConfig> = {
  generate: {
    label: 'Generate Code',
    icon: <Code className="w-4 h-4" />,
    placeholder: 'Describe the code you want to generate...',
    requiresCode: false,
    requiresInstructions: false,
    requiresError: false,
    requiresMessages: false,
  },
  refactor: {
    label: 'Refactor Code',
    icon: <Zap className="w-4 h-4" />,
    placeholder: 'Paste your code here...',
    requiresCode: true,
    requiresInstructions: true,
    requiresError: false,
    requiresMessages: false,
  },
  explain: {
    label: 'Explain Code',
    icon: <Brain className="w-4 h-4" />,
    placeholder: 'Paste the code you want explained...',
    requiresCode: true,
    requiresInstructions: false,
    requiresError: false,
    requiresMessages: false,
  },
  debug: {
    label: 'Debug Code',
    icon: <Bug className="w-4 h-4" />,
    placeholder: 'Paste your code here...',
    requiresCode: true,
    requiresInstructions: false,
    requiresError: true,
    requiresMessages: false,
  },
  optimize: {
    label: 'Optimize Code',
    icon: <TrendingUp className="w-4 h-4" />,
    placeholder: 'Paste your code here...',
    requiresCode: true,
    requiresInstructions: false,
    requiresError: false,
    requiresMessages: false,
  },
  'generate-tests': {
    label: 'Generate Tests',
    icon: <TestTube className="w-4 h-4" />,
    placeholder: 'Paste your code here...',
    requiresCode: true,
    requiresInstructions: false,
    requiresError: false,
    requiresMessages: false,
  },
  'chat': {
    label: 'Chat',
    icon: <Brain className="w-4 h-4" />,
    placeholder: 'Ask me anything about coding...',
    requiresCode: false,
    requiresInstructions: false,
    requiresError: false,
    requiresMessages: true,
  },
};

export default function GeminiCodingAssistant() {
  const [action, setAction] = useState<ActionType>('generate');
  const [code, setCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testFramework, setTestFramework] = useState('jest');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'model', content: string}>>([]);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php', 'ruby'
  ];

  const testFrameworks = [
    'jest', 'mocha', 'jasmine', 'vitest', 'pytest', 'junit', 'nunit'
  ];

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/gemini');
      const data = await response.json();
      setIsConfigured(data.configured);
      if (!data.configured) {
        setApiError(data.error || 'Gemini service is not configured');
      }
    } catch (error) {
      setIsConfigured(false);
      setApiError('Failed to check Gemini service configuration');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    setResponse('');

    try {
      const requestBody: any = {
        action,
        language,
      };

      // Add action-specific parameters
      if (action === 'generate') {
        requestBody.prompt = prompt;
        requestBody.context = '';
      } else if (action === 'refactor') {
        requestBody.code = code;
        requestBody.instructions = instructions;
      } else if (action === 'explain') {
        requestBody.code = code;
      } else if (action === 'debug') {
        requestBody.code = code;
        requestBody.error = error;
      } else if (action === 'optimize') {
        requestBody.code = code;
      } else if (action === 'generate-tests') {
        requestBody.code = code;
        requestBody.testFramework = testFramework;
      } else if (action === 'chat') {
        requestBody.messages = [...messages, { role: 'user', content: prompt }];
      }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: GeminiResponse = await response.json();

      if (data.success && data.data) {
        setResponse(data.data);
        if (action === 'chat') {
          setMessages(prev => [...prev, { role: 'user', content: prompt }, { role: 'model', content: data.data! }]);
          setPrompt('');
        }
      } else {
        setApiError(data.error || 'An error occurred while processing your request');
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const config = actionConfigs[action];

    if (config.requiresCode && !code.trim()) {
      setApiError('Code is required for this action');
      return false;
    }

    if (config.requiresInstructions && !instructions.trim()) {
      setApiError('Instructions are required for refactoring');
      return false;
    }

    if (config.requiresError && !error.trim()) {
      setApiError('Error message is required for debugging');
      return false;
    }

    if (action === 'generate' && !prompt.trim()) {
      setApiError('Prompt is required for code generation');
      return false;
    }

    if (action === 'chat' && !prompt.trim()) {
      setApiError('Message is required for chat');
      return false;
    }

    return true;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const resetForm = () => {
    setCode('');
    setPrompt('');
    setInstructions('');
    setError('');
    setResponse('');
    setApiError('');
    setMessages([]);
  };

  if (isConfigured === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (isConfigured === false) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <ErrorMessage message={apiError || 'Gemini service is not configured'} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Gemini 2.0 Flash Coding Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={action} onValueChange={(value) => setAction(value as ActionType)}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              {Object.entries(actionConfigs).map(([key, config]) => (
                <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                  {config.icon}
                  <span className="hidden sm:inline">{config.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(actionConfigs).map(([actionKey, config]) => (
              <TabsContent key={actionKey} value={actionKey} className="space-y-4">
                <div className="grid gap-4">
                  {/* Language Selection */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Test Framework Selection (only for generate-tests) */}
                    {actionKey === 'generate-tests' && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Test Framework</label>
                        <Select value={testFramework} onValueChange={setTestFramework}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select test framework" />
                          </SelectTrigger>
                          <SelectContent>
                            {testFrameworks.map((framework) => (
                              <SelectItem key={framework} value={framework}>
                                {framework.charAt(0).toUpperCase() + framework.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Chat Messages Display */}
                  {actionKey === 'chat' && messages.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {messages.map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' : 'bg-gray-50 dark:bg-gray-800 mr-8'}`}>
                          <div className="text-sm font-medium mb-1">
                            {msg.role === 'user' ? 'You' : 'Gemini'}
                          </div>
                          <div className="text-sm">{msg.content}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input Fields */}
                  {actionKey === 'generate' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Prompt</label>
                      <Textarea
                        placeholder={config.placeholder}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}

                  {actionKey === 'chat' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        placeholder={config.placeholder}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}

                  {config.requiresCode && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Code</label>
                      <Textarea
                        placeholder={config.placeholder}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}

                  {config.requiresInstructions && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Refactoring Instructions</label>
                      <Textarea
                        placeholder="Describe how you want the code to be refactored..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={3}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}

                  {config.requiresError && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Error Message</label>
                      <Textarea
                        placeholder="Paste the error message here..."
                        value={error}
                        onChange={(e) => setError(e.target.value)}
                        rows={3}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? <LoadingSpinner /> : config.icon}
                      {loading ? 'Processing...' : config.label}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Clear
                    </Button>
                  </div>

                  {/* Error Display */}
                  {apiError && (
                    <ErrorMessage message={apiError} />
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Result
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono whitespace-pre-wrap">
                  {response}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
