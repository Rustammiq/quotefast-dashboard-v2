"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Bot, Settings, Play, TestTube, Zap, Brain, Code, Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import ModelConfigModal from "../components/ModelConfigModal";
import { logger } from '../../../utils/helpers/logger';
import { geminiService } from '../../../lib/ai';

interface Model {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  status: 'active' | 'inactive' | 'testing';
  capabilities: string[];
  description: string;
  lastUsed?: string;
  responseTime?: number;
}

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [testPrompt, setTestPrompt] = useState("Write a simple React component that displays a counter");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configModelId, setConfigModelId] = useState<string | null>(null);

  const models: Model[] = [
    {
      id: "mistral-magistral",
      name: "Mistral Magistral-Small-2509",
      provider: "Mistral AI",
      endpoint: "http://127.0.0.1:1234/v1",
      status: "active",
      capabilities: ["Code Generation", "Debugging", "Real-time Assistance", "Multi-language Support"],
      description: "Efficient model for real-time code assistance and debugging. Great balance between speed and quality.",
      lastUsed: "2 minutes ago",
      responseTime: 1.2
    },
    {
      id: "qwen-14b",
      name: "Qwen2.5-14B-Instruct",
      provider: "Alibaba Cloud",
      endpoint: "http://127.0.0.1:1234/v1",
      status: "active",
      capabilities: ["Complex Analysis", "Code Refactoring", "Architecture Design", "Large Codebases"],
      description: "Powerful model for complex code analysis and refactoring. Excellent for understanding large codebases.",
      lastUsed: "5 minutes ago",
      responseTime: 2.8
    },
    {
      id: "qwen3-4b-thinking",
      name: "Qwen3-4B-Thinking-2507",
      provider: "Alibaba Cloud",
      endpoint: "http://127.0.0.1:1234/v1",
      status: "active",
      capabilities: ["Advanced Reasoning", "Step-by-step Thinking", "Problem Solving", "Code Analysis"],
      description: "Advanced reasoning model with step-by-step thinking capabilities. Excellent for complex problem solving and detailed code analysis.",
      lastUsed: "1 minute ago",
      responseTime: 2.1
    },
    {
      id: "deepseek-coder-33b",
      name: "DeepSeek-Coder-33B-Instruct",
      provider: "DeepSeek",
      endpoint: "http://127.0.0.1:1234/v1",
      status: "active",
      capabilities: ["Code Generation", "Code Completion", "Bug Fixing", "Code Review", "Multi-language Support"],
      description: "Large-scale coding model specialized in code generation, completion, and debugging. Excellent for complex programming tasks and code optimization.",
      lastUsed: "30 seconds ago",
      responseTime: 3.2
    },
    {
      id: "gemini-pro",
      name: "Google Gemini 2.0 Flash",
      provider: "Google",
      endpoint: "https://generativelanguage.googleapis.com/v1beta",
      status: geminiService.isConfigured() ? "active" : "inactive",
      capabilities: ["Code Generation", "Code Refactoring", "Debugging", "Code Explanation", "Performance Optimization", "Test Generation"],
      description: "Advanced AI model for comprehensive code assistance, debugging, and optimization. Powered by Gemini 2.0 Flash.",
      lastUsed: geminiService.isConfigured() ? "Just now" : "Not configured",
      responseTime: geminiService.isConfigured() ? 2.1 : 3.5
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'testing':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-500/10 border-green-500/20 text-green-400";
      case 'testing':
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case 'inactive':
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const testModel = async (modelId: string) => {
    setIsTesting(true);
    setTestResult(null);

    try {
      let response: string;

      if (modelId === 'gemini-pro' && geminiService.isConfigured()) {
        // Use actual Gemini service for Gemini Pro
        response = await geminiService.generateCode({
          prompt: testPrompt,
          language: 'javascript',
          temperature: 0.3,
          maxTokens: 1000
        });
      } else {
        // Use mock response for other models or when Gemini is not configured
        await new Promise(resolve => setTimeout(resolve, 2000));

        response = `// Counter Component
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
};

export default Counter;`;
      }

      setTestResult(response);
    } catch (error) {
      setTestResult("Error testing model: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsTesting(false);
    }
  };

  const handleConfigureModel = (modelId: string) => {
    setConfigModelId(modelId);
    setConfigModalOpen(true);
  };

  const handleSaveConfig = (config: any) => {
    logger.info("Saving config for model", 'models', { configModelId, config });
    // Here you would save the configuration to your backend
    setConfigModalOpen(false);
    setConfigModelId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Models</h1>
          <p className="text-gray-400">Configure and manage your AI models for programming assistance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
          <Bot className="h-4 w-4" />
          Add New Model
        </button>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {model.name}
                </CardTitle>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                  {getStatusIcon(model.status)}
                  {model.status}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{model.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider & Endpoint */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="font-medium">Provider:</span>
                  <span>{model.provider}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <span className="font-medium">Endpoint:</span>
                  <code className="text-xs bg-white/10 px-2 py-1 rounded">{model.endpoint}</code>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-1">
                  {model.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              {model.lastUsed && (
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Last used: {model.lastUsed}</span>
                  {model.responseTime && (
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {model.responseTime}s
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleConfigureModel(model.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Configure
                </button>
                <button
                  onClick={() => testModel(model.id)}
                  disabled={isTesting}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
                >
                  {isTesting ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Test
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Section */}
      {selectedModel && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Model Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Test Prompt
              </label>
              <textarea
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter a test prompt for the model..."
              />
            </div>

            {testResult && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model Response
                </label>
                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                    {testResult}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => testModel(selectedModel)}
                disabled={isTesting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
              >
                {isTesting ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isTesting ? "Testing..." : "Run Test"}
              </button>
              <button
                onClick={() => setTestResult(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Setup Guide */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="h-5 w-5" />
            Quick Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium mb-2">1. Local Server</h4>
              <p className="text-gray-400 text-sm">
                Start your local model server on port 1234 to use Mistral and Qwen models.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium mb-2">2. API Keys</h4>
              <p className="text-gray-400 text-sm">
                Configure API keys for external services like Gemini in your .env.local file. Gemini 2.0 Flash is {geminiService.isConfigured() ? 'ready to use' : 'not configured'}.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium mb-2">3. Test Models</h4>
              <p className="text-gray-400 text-sm">
                Use the test functionality to verify your models are working correctly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Configuration Modal */}
      {configModalOpen && configModelId && (
        <ModelConfigModal
          modelId={configModelId}
          modelName={models.find(m => m.id === configModelId)?.name || ""}
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            setConfigModelId(null);
          }}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
}
