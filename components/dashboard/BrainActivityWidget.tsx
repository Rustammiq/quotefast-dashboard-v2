'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardBrainAnimation from '../ui/DashboardBrainAnimation'
import { Activity, Brain, Zap, Users, Cpu } from 'lucide-react'

interface BrainActivityWidgetProps {
  className?: string
  title?: string
  showMetrics?: boolean
}

export default function BrainActivityWidget({ 
  className = '',
  title = 'AI Brain Activity',
  showMetrics = true
}: BrainActivityWidgetProps) {
  const [activity, setActivity] = useState({
    ai: 0.3,
    human: 0.2,
    processing: 0.1,
    connections: 12
  })

  const [isActive, setIsActive] = useState(false)

  // Simulate activity changes
  useEffect(() => {
    const interval = setInterval(() => {
      setActivity(prev => ({
        ai: Math.min(1, prev.ai + (Math.random() - 0.5) * 0.1),
        human: Math.min(1, prev.human + (Math.random() - 0.5) * 0.08),
        processing: Math.min(1, prev.processing + (Math.random() - 0.5) * 0.12),
        connections: Math.max(8, Math.min(20, prev.connections + Math.floor((Math.random() - 0.5) * 2)))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Determine intensity based on activity
  const getIntensity = () => {
    const avgActivity = (activity.ai + activity.human + activity.processing) / 3
    if (avgActivity > 0.7) return 'high'
    if (avgActivity > 0.4) return 'medium'
    return 'low'
  }

  return (
    <motion.div
      className={`glass-card rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <motion.div
          className={`w-3 h-3 rounded-full ${
            isActive ? 'bg-green-500' : 'bg-gray-500'
          }`}
          animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        />
      </div>

      {/* Brain Animation */}
      <div className="flex justify-center mb-6">
        <motion.div
          className="relative"
          animate={{ 
            scale: isActive ? [1, 1.05, 1] : 1,
            rotate: isActive ? [0, 1, -1, 0] : 0
          }}
          transition={{ 
            duration: 2, 
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <DashboardBrainAnimation
            size="medium"
            intensity={getIntensity() as 'low' | 'medium' | 'high'}
            showActivity={isActive}
          />
        </motion.div>
      </div>

      {/* Activity Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <span className="text-sm text-gray-300">AI Activity</span>
          <span className="text-sm text-white font-medium">
            {Math.round(activity.ai * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-300">Human Input</span>
          <span className="text-sm text-white font-medium">
            {Math.round(activity.human * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-sm text-gray-300">Processing</span>
          <span className="text-sm text-white font-medium">
            {Math.round(activity.processing * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm text-gray-300">Connections</span>
          <span className="text-sm text-white font-medium">
            {activity.connections}
          </span>
        </div>
      </div>

      {/* Activity Bars */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>AI Processing</span>
            <span>{Math.round(activity.ai * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <motion.div
              className="bg-purple-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${activity.ai * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Human Interaction</span>
            <span>{Math.round(activity.human * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <motion.div
              className="bg-green-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${activity.human * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Data Processing</span>
            <span>{Math.round(activity.processing * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <motion.div
              className="bg-orange-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${activity.processing * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isActive ? 'Pause Activity' : 'Start Activity'}
        </button>
        <button
          onClick={() => {
            setActivity({
              ai: Math.random(),
              human: Math.random(),
              processing: Math.random(),
              connections: Math.floor(Math.random() * 15) + 8
            })
          }}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          title="Simulate random activity"
          aria-label="Simulate random neural activity"
        >
          <Zap className="w-4 h-4" />
        </button>
      </div>

      {/* Status Text */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">
          {isActive ? 'Neural network is actively processing' : 'Neural network is in standby mode'}
        </p>
      </div>
    </motion.div>
  )
}
