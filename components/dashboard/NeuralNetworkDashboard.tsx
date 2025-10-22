'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InteractiveBrainNeuralNetwork from '../ui/InteractiveBrainNeuralNetwork'
import { geminiService } from '@/lib/gemini-service'

interface NeuralActivity {
  id: string
  type: 'ai_request' | 'human_input' | 'processing' | 'output' | 'error'
  timestamp: number
  duration: number
  intensity: number
  data?: any
  status: 'active' | 'completed' | 'failed'
}

interface NeuralMetrics {
  totalRequests: number
  activeConnections: number
  processingTime: number
  successRate: number
  aiActivity: number
  humanActivity: number
}

export default function NeuralNetworkDashboard() {
  const [activities, setActivities] = useState<NeuralActivity[]>([])
  const [metrics, setMetrics] = useState<NeuralMetrics>({
    totalRequests: 0,
    activeConnections: 0,
    processingTime: 0,
    successRate: 100,
    aiActivity: 0,
    humanActivity: 0
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<NeuralActivity | null>(null)

  // Simulate AI processing activity
  const simulateAIProcessing = useCallback(async () => {
    setIsProcessing(true)
    
    const activityId = `ai_${Date.now()}`
    const newActivity: NeuralActivity = {
      id: activityId,
      type: 'ai_request',
      timestamp: Date.now(),
      duration: 0,
      intensity: 0.8,
      status: 'active',
      data: { prompt: 'Processing neural network request...' }
    }

    setActivities(prev => [newActivity, ...prev.slice(0, 19)]) // Keep last 20 activities

    // Simulate processing time
    const processingTime = 2000 + Math.random() * 3000
    await new Promise(resolve => setTimeout(resolve, processingTime))

    // Update activity as completed
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: 'completed', duration: processingTime }
        : activity
    ))

    setIsProcessing(false)
  }, [])

  // Simulate human input activity
  const simulateHumanInput = useCallback(() => {
    const activityId = `human_${Date.now()}`
    const newActivity: NeuralActivity = {
      id: activityId,
      type: 'human_input',
      timestamp: Date.now(),
      duration: 500 + Math.random() * 1000,
      intensity: 0.6,
      status: 'active',
      data: { input: 'User interaction detected' }
    }

    setActivities(prev => [newActivity, ...prev.slice(0, 19)])

    // Mark as completed after short duration
    setTimeout(() => {
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: 'completed' }
          : activity
      ))
    }, newActivity.duration)
  }, [])

  // Update metrics based on activities
  useEffect(() => {
    const completedActivities = activities.filter(a => a.status === 'completed')
    const activeActivities = activities.filter(a => a.status === 'active')
    const successfulActivities = completedActivities.filter(a => a.type !== 'error')
    
    const avgProcessingTime = completedActivities.length > 0 
      ? completedActivities.reduce((sum, a) => sum + a.duration, 0) / completedActivities.length
      : 0

    const successRate = completedActivities.length > 0
      ? (successfulActivities.length / completedActivities.length) * 100
      : 100

    const aiActivity = activities.filter(a => 
      a.type === 'ai_request' && a.status === 'active'
    ).length / 10 // Normalize to 0-1

    const humanActivity = activities.filter(a => 
      a.type === 'human_input' && a.status === 'active'
    ).length / 5 // Normalize to 0-1

    setMetrics({
      totalRequests: activities.length,
      activeConnections: activeActivities.length,
      processingTime: avgProcessingTime,
      successRate,
      aiActivity: Math.min(1, aiActivity),
      humanActivity: Math.min(1, humanActivity)
    })
  }, [activities])

  // Auto-simulate activities
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        simulateAIProcessing()
      }
      if (Math.random() < 0.4) {
        simulateHumanInput()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [simulateAIProcessing, simulateHumanInput])

  const handleNeuronClick = (neuron: any) => {
    // Neuron clicked - could add detailed interaction here
    // You can add more detailed neuron interaction here
  }

  const getActivityIcon = (type: NeuralActivity['type']) => {
    switch (type) {
      case 'ai_request': return '🤖'
      case 'human_input': return '👤'
      case 'processing': return '⚡'
      case 'output': return '📤'
      case 'error': return '❌'
      default: return '🔵'
    }
  }

  const getActivityColor = (type: NeuralActivity['type']) => {
    switch (type) {
      case 'ai_request': return 'text-purple-400'
      case 'human_input': return 'text-green-400'
      case 'processing': return 'text-orange-400'
      case 'output': return 'text-blue-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 Neural Network Dashboard
          </h1>
          <p className="text-gray-300">
            Real-time AI brain activity monitoring and neural network visualization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Neural Network Visualization */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-6 h-96 relative overflow-hidden">
              <h2 className="text-xl font-semibold text-white mb-4">
                Interactive Neural Network
              </h2>
              
              <InteractiveBrainNeuralNetwork
                className="absolute inset-0"
                onNeuronClick={handleNeuronClick}
                showActivity={true}
                aiProcessing={isProcessing}
                humanInput={metrics.humanActivity > 0}
              />

              {/* Control buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={simulateAIProcessing}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'AI Request'}
                </button>
                <button
                  onClick={simulateHumanInput}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                >
                  Human Input
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Neural Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Requests</span>
                  <span className="text-white font-semibold">{metrics.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Active Connections</span>
                  <span className="text-white font-semibold">{metrics.activeConnections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Avg Processing Time</span>
                  <span className="text-white font-semibold">
                    {Math.round(metrics.processingTime)}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-white font-semibold">
                    {metrics.successRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Levels */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Activity Levels</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">AI Activity</span>
                    <span className="text-purple-400 font-semibold">
                      {Math.round(metrics.aiActivity * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.aiActivity * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Human Activity</span>
                    <span className="text-green-400 font-semibold">
                      {Math.round(metrics.humanActivity * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.humanActivity * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Neural Activity Feed</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedActivity?.id === activity.id 
                        ? 'bg-blue-600/20 border border-blue-500' 
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      <div>
                        <div className={`font-medium ${getActivityColor(activity.type)}`}>
                          {activity.type.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'active' ? 'bg-green-500' :
                        activity.status === 'completed' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm text-gray-400">
                        {activity.status === 'active' ? 'Active' :
                         activity.status === 'completed' ? 'Completed' : 'Failed'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Selected Activity Details */}
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Activity Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm">Type</label>
                <div className={`font-medium ${getActivityColor(selectedActivity.type)}`}>
                  {selectedActivity.type.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Status</label>
                <div className="text-white font-medium">
                  {selectedActivity.status.toUpperCase()}
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Timestamp</label>
                <div className="text-white font-medium">
                  {new Date(selectedActivity.timestamp).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Duration</label>
                <div className="text-white font-medium">
                  {selectedActivity.duration}ms
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Intensity</label>
                <div className="text-white font-medium">
                  {Math.round(selectedActivity.intensity * 100)}%
                </div>
              </div>
              {selectedActivity.data && (
                <div className="md:col-span-2">
                  <label className="text-gray-300 text-sm">Data</label>
                  <div className="text-white font-medium bg-gray-800 p-2 rounded mt-1">
                    {JSON.stringify(selectedActivity.data, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
