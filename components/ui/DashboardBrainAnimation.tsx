'use client'
import React, { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Neuron {
  id: number
  x: number
  y: number
  connections: number[]
  pulsePhase: number
  pulseSpeed: number
  type: 'ai' | 'human' | 'bridge' | 'processing'
  activity: number
  lastActivated: number
}

interface DashboardBrainAnimationProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
  intensity?: 'low' | 'medium' | 'high'
  showActivity?: boolean
}

export default function DashboardBrainAnimation({ 
  className = '',
  size = 'medium',
  intensity = 'medium',
  showActivity = true
}: DashboardBrainAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const neuronsRef = useRef<Neuron[]>([])
  const timeRef = useRef(0)

  // Size configurations
  const sizeConfig = {
    small: { width: 200, height: 160, neuronCount: 15 },
    medium: { width: 300, height: 240, neuronCount: 25 },
    large: { width: 400, height: 320, neuronCount: 35 }
  }

  // Intensity configurations
  const intensityConfig = {
    low: { opacity: 0.3, pulseSpeed: 0.005, particleCount: 5 },
    medium: { opacity: 0.5, pulseSpeed: 0.01, particleCount: 8 },
    high: { opacity: 0.7, pulseSpeed: 0.015, particleCount: 12 }
  }

  const config = sizeConfig[size]
  const intensitySettings = intensityConfig[intensity]

  // Initialize neurons for dashboard use
  const initializeNeurons = (width: number, height: number): Neuron[] => {
    const neurons: Neuron[] = []
    const centerX = width / 2
    const centerY = height / 2
    
    // Create compact brain hemispheres for dashboard
    const hemispheres = [
      { offsetX: -20, offsetY: 0, name: 'left' },
      { offsetX: 20, offsetY: 0, name: 'right' }
    ]

    hemispheres.forEach((hemisphere, hIndex) => {
      // Compact brain layers
      const layers = [
        { radius: 50, count: 6, name: 'cortex' },
        { radius: 35, count: 4, name: 'subcortex' },
        { radius: 20, count: 3, name: 'deep' },
        { radius: 10, count: 2, name: 'core' }
      ]

      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          const angle = (i / layer.count) * Math.PI * 2 + (hIndex * Math.PI)
          const x = centerX + hemisphere.offsetX + Math.cos(angle) * layer.radius
          const y = centerY + hemisphere.offsetY + Math.sin(angle) * layer.radius * 0.7
          
          // Determine neuron type
          let type: Neuron['type'] = 'bridge'
          if (hemisphere.name === 'left') {
            type = 'human'
          } else if (hemisphere.name === 'right') {
            type = 'ai'
          }
          
          neurons.push({
            id: neurons.length,
            x,
            y,
            connections: [],
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: intensitySettings.pulseSpeed + Math.random() * 0.005,
            type,
            activity: 0,
            lastActivated: 0
          })
        }
      })
    })

    // Add corpus callosum
    for (let i = 0; i < 6; i++) {
      const x = centerX + (Math.random() - 0.5) * 20
      const y = centerY + (Math.random() - 0.5) * 15
      
      neurons.push({
        id: neurons.length,
        x,
        y,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: intensitySettings.pulseSpeed + Math.random() * 0.008,
        type: 'bridge',
        activity: 0,
        lastActivated: 0
      })
    }

    // Add processing neurons
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      const x = centerX + Math.cos(angle) * 8
      const y = centerY + Math.sin(angle) * 6
      
      neurons.push({
        id: neurons.length,
        x,
        y,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: intensitySettings.pulseSpeed + Math.random() * 0.01,
        type: 'processing',
        activity: 0,
        lastActivated: 0
      })
    }

    // Create connections
    neurons.forEach((neuron, i) => {
      neurons.forEach((otherNeuron, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(neuron.x - otherNeuron.x, 2) + 
            Math.pow(neuron.y - otherNeuron.y, 2)
          )
          
          const shouldConnect = 
            (distance < 25 && Math.random() < 0.4) ||
            (neuron.type === otherNeuron.type && distance < 35 && Math.random() < 0.3) ||
            (neuron.type === 'bridge' && distance < 30 && Math.random() < 0.5)
          
          if (shouldConnect && !neuron.connections.includes(j)) {
            neuron.connections.push(j)
          }
        }
      })
    })

    return neurons
  }

  // Simulate subtle activity for dashboard
  const simulateActivity = useCallback(() => {
    if (!showActivity) return

    const now = Date.now()
    const neurons = neuronsRef.current

    // Random subtle activity
    neurons.forEach(neuron => {
      if (Math.random() < 0.02) {
        neuron.activity = Math.min(1, neuron.activity + 0.1)
        neuron.lastActivated = now
      }
    })

    // Decay activity
    neurons.forEach(neuron => {
      neuron.activity = Math.max(0, neuron.activity - 0.005)
    })
  }, [showActivity])

  const drawNeuron = (ctx: CanvasRenderingContext2D, neuron: Neuron, time: number) => {
    const pulse = Math.sin(time * neuron.pulseSpeed + neuron.pulsePhase)
    const activityPulse = neuron.activity * Math.sin(time * 0.03)
    const size = 2 + pulse * 1 + activityPulse * 1.5
    const opacity = intensitySettings.opacity * (0.6 + pulse * 0.3 + neuron.activity * 0.2)

    // Subtle colors for dashboard
    let neuronColor = 'rgba(59, 130, 246, '
    let glowColor = 'rgba(59, 130, 246, '
    
    if (neuron.type === 'ai') {
      neuronColor = `rgba(147, 51, 234, `
      glowColor = `rgba(147, 51, 234, `
    } else if (neuron.type === 'human') {
      neuronColor = `rgba(34, 197, 94, `
      glowColor = `rgba(34, 197, 94, `
    } else if (neuron.type === 'bridge') {
      neuronColor = `rgba(251, 191, 36, `
      glowColor = `rgba(251, 191, 36, `
    } else if (neuron.type === 'processing') {
      neuronColor = `rgba(255, 165, 0, `
      glowColor = `rgba(255, 165, 0, `
    }

    // Draw neuron glow (subtle)
    ctx.beginPath()
    ctx.arc(neuron.x, neuron.y, size + 2, 0, Math.PI * 2)
    ctx.fillStyle = glowColor + (opacity * 0.2) + ')'
    ctx.fill()

    // Draw neuron body
    ctx.beginPath()
    ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2)
    ctx.fillStyle = neuronColor + opacity + ')'
    ctx.fill()

    // Draw connections (subtle)
    neuron.connections.forEach(connectionId => {
      const connectedNeuron = neuronsRef.current[connectionId]
      if (connectedNeuron) {
        const connectionIntensity = (neuron.activity + connectedNeuron.activity) / 2
        const connectionOpacity = 0.05 + connectionIntensity * 0.1
        
        ctx.beginPath()
        ctx.moveTo(neuron.x, neuron.y)
        ctx.lineTo(connectedNeuron.x, connectedNeuron.y)
        ctx.strokeStyle = glowColor + connectionOpacity + ')'
        ctx.lineWidth = 0.5 + connectionIntensity * 0.5
        ctx.stroke()
      }
    })
  }

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    timeRef.current += 0.016

    // Simulate activity
    simulateActivity()

    // Draw all neurons
    neuronsRef.current.forEach(neuron => {
      drawNeuron(ctx, neuron, timeRef.current)
    })

    // Draw subtle floating particles
    for (let i = 0; i < intensitySettings.particleCount; i++) {
      const angle = timeRef.current * 0.005 + i * Math.PI / (intensitySettings.particleCount / 2)
      const radius = 60 + Math.sin(timeRef.current * 0.01 + i) * 20
      const x = width / 2 + Math.cos(angle) * radius
      const y = height / 2 + Math.sin(angle) * radius * 0.7

      const centerX = width / 2
      let particleColor = 'rgba(147, 197, 253, '

      if (x > centerX + 10) {
        particleColor = 'rgba(168, 85, 247, '
      } else if (x < centerX - 10) {
        particleColor = 'rgba(34, 197, 94, '
      } else {
        particleColor = 'rgba(251, 191, 36, '
      }

      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fillStyle = particleColor + (intensitySettings.opacity * 0.3) + ')'
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [simulateActivity, intensitySettings])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = config.width * window.devicePixelRatio
      canvas.height = config.height * window.devicePixelRatio
      canvas.style.width = config.width + 'px'
      canvas.style.height = config.height + 'px'
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }

      // Initialize neurons
      neuronsRef.current = initializeNeurons(config.width, config.height)
    }

    resizeCanvas()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, config])

  // Set canvas size via useEffect
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.style.width = config.width + 'px'
      canvas.style.height = config.height + 'px'
    }
  }, [config.width, config.height])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-transparent"
      />
      
      {/* Subtle overlay for dashboard integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/5 to-transparent" />
    </div>
  )
}
