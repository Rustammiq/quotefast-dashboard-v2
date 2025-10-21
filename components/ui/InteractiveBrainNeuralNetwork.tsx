'use client'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

interface Neuron {
  id: number
  x: number
  y: number
  connections: number[]
  pulsePhase: number
  pulseSpeed: number
  type: 'ai' | 'human' | 'bridge' | 'processing'
  activity: number // 0-1, how active this neuron is
  lastActivated: number
  layer: 'cortex' | 'subcortex' | 'deep' | 'core'
}

interface NeuralActivity {
  type: 'ai_request' | 'human_input' | 'processing' | 'output'
  intensity: number
  timestamp: number
  data?: any
}

interface InteractiveBrainNeuralNetworkProps {
  className?: string
  onNeuronClick?: (neuron: Neuron) => void
  showActivity?: boolean
  aiProcessing?: boolean
  humanInput?: boolean
}

export default function InteractiveBrainNeuralNetwork({ 
  className = '',
  onNeuronClick,
  showActivity = true,
  aiProcessing = false,
  humanInput = false
}: InteractiveBrainNeuralNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const neuronsRef = useRef<Neuron[]>([])
  const timeRef = useRef(0)
  const [selectedNeuron, setSelectedNeuron] = useState<Neuron | null>(null)
  const [neuralActivity, setNeuralActivity] = useState<NeuralActivity[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Initialize neurons with enhanced structure
  const initializeNeurons = (width: number, height: number): Neuron[] => {
    const neurons: Neuron[] = []
    const centerX = width / 2
    const centerY = height / 2
    
    // Create enhanced brain hemispheres with more detailed structure
    const hemispheres = [
      { offsetX: -30, offsetY: 0, name: 'left' },
      { offsetX: 30, offsetY: 0, name: 'right' }
    ]

    hemispheres.forEach((hemisphere, hIndex) => {
      // Enhanced brain layers with more neurons
      const layers = [
        { radius: 80, count: 15, name: 'cortex' as const },
        { radius: 60, count: 12, name: 'subcortex' as const },
        { radius: 40, count: 8, name: 'deep' as const },
        { radius: 20, count: 4, name: 'core' as const }
      ]

      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          const angle = (i / layer.count) * Math.PI * 2 + (hIndex * Math.PI)
          const x = centerX + hemisphere.offsetX + Math.cos(angle) * layer.radius
          const y = centerY + hemisphere.offsetY + Math.sin(angle) * layer.radius * 0.7
          
          // Determine neuron type based on position
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
            pulseSpeed: 0.01 + Math.random() * 0.02,
            type,
            activity: 0,
            lastActivated: 0,
            layer: layer.name
          })
        }
      })
    })

    // Add corpus callosum with more connections
    for (let i = 0; i < 12; i++) {
      const x = centerX + (Math.random() - 0.5) * 30
      const y = centerY + (Math.random() - 0.5) * 20
      
      neurons.push({
        id: neurons.length,
        x,
        y,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.015,
        type: 'bridge',
        activity: 0,
        lastActivated: 0,
        layer: 'cortex'
      })
    }

    // Add processing neurons in the center
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const x = centerX + Math.cos(angle) * 15
      const y = centerY + Math.sin(angle) * 10
      
      neurons.push({
        id: neurons.length,
        x,
        y,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.025 + Math.random() * 0.01,
        type: 'processing',
        activity: 0,
        lastActivated: 0,
        layer: 'core'
      })
    }

    // Create connections between nearby neurons
    neurons.forEach((neuron, i) => {
      neurons.forEach((otherNeuron, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(neuron.x - otherNeuron.x, 2) + 
            Math.pow(neuron.y - otherNeuron.y, 2)
          )
          
          // Connect neurons based on distance and type
          const shouldConnect = 
            (distance < 40 && Math.random() < 0.3) || // Close neurons
            (neuron.type === otherNeuron.type && distance < 60 && Math.random() < 0.2) || // Same type
            (neuron.type === 'bridge' && distance < 50 && Math.random() < 0.4) // Bridge connections
          
          if (shouldConnect && !neuron.connections.includes(j)) {
            neuron.connections.push(j)
          }
        }
      })
    })

    return neurons
  }

  // Simulate neural activity based on AI processing and human input
  const simulateNeuralActivity = useCallback(() => {
    if (!showActivity) return

    const now = Date.now()
    const neurons = neuronsRef.current

    // AI processing activity
    if (aiProcessing) {
      const aiNeurons = neurons.filter(n => n.type === 'ai' || n.type === 'processing')
      aiNeurons.forEach(neuron => {
        if (Math.random() < 0.1) {
          neuron.activity = Math.min(1, neuron.activity + 0.3)
          neuron.lastActivated = now
        }
      })
    }

    // Human input activity
    if (humanInput) {
      const humanNeurons = neurons.filter(n => n.type === 'human' || n.type === 'bridge')
      humanNeurons.forEach(neuron => {
        if (Math.random() < 0.08) {
          neuron.activity = Math.min(1, neuron.activity + 0.2)
          neuron.lastActivated = now
        }
      })
    }

    // Decay activity over time
    neurons.forEach(neuron => {
      neuron.activity = Math.max(0, neuron.activity - 0.01)
    })

    // Add random activity for organic feel
    neurons.forEach(neuron => {
      if (Math.random() < 0.005) {
        neuron.activity = Math.min(1, neuron.activity + 0.1)
        neuron.lastActivated = now
      }
    })
  }, [aiProcessing, humanInput, showActivity])

  const drawNeuron = (ctx: CanvasRenderingContext2D, neuron: Neuron, time: number) => {
    const pulse = Math.sin(time * neuron.pulseSpeed + neuron.pulsePhase)
    const activityPulse = neuron.activity * Math.sin(time * 0.05)
    const size = 3 + pulse * 2 + activityPulse * 3
    const opacity = 0.6 + pulse * 0.4 + neuron.activity * 0.4

    // Enhanced colors based on neuron type and activity
    let neuronColor = 'rgba(59, 130, 246, '
    let glowColor = 'rgba(59, 130, 246, '
    let glowSize = size + 3
    
    if (neuron.type === 'ai') {
      neuronColor = `rgba(147, 51, 234, ` // Purple
      glowColor = `rgba(147, 51, 234, `
      if (neuron.activity > 0.5) {
        glowSize = size + 8
        glowColor = `rgba(255, 0, 255, ` // Bright magenta when active
      }
    } else if (neuron.type === 'human') {
      neuronColor = `rgba(34, 197, 94, ` // Green
      glowColor = `rgba(34, 197, 94, `
      if (neuron.activity > 0.5) {
        glowSize = size + 8
        glowColor = `rgba(0, 255, 255, ` // Bright cyan when active
      }
    } else if (neuron.type === 'bridge') {
      neuronColor = `rgba(251, 191, 36, ` // Amber
      glowColor = `rgba(251, 191, 36, `
      if (neuron.activity > 0.5) {
        glowSize = size + 8
        glowColor = `rgba(255, 255, 0, ` // Bright yellow when active
      }
    } else if (neuron.type === 'processing') {
      neuronColor = `rgba(255, 165, 0, ` // Orange
      glowColor = `rgba(255, 165, 0, `
      if (neuron.activity > 0.5) {
        glowSize = size + 10
        glowColor = `rgba(255, 100, 0, ` // Bright orange when active
      }
    }

    // Draw neuron glow
    ctx.beginPath()
    ctx.arc(neuron.x, neuron.y, glowSize, 0, Math.PI * 2)
    ctx.fillStyle = glowColor + (opacity * 0.3) + ')'
    ctx.fill()

    // Draw neuron body
    ctx.beginPath()
    ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2)
    ctx.fillStyle = neuronColor + opacity + ')'
    ctx.fill()

    // Draw activity indicator
    if (neuron.activity > 0.3) {
      ctx.beginPath()
      ctx.arc(neuron.x, neuron.y, size + 2, 0, Math.PI * 2)
      ctx.strokeStyle = glowColor + '1)'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw connections with activity-based intensity
    neuron.connections.forEach(connectionId => {
      const connectedNeuron = neuronsRef.current[connectionId]
      if (connectedNeuron) {
        const connectionIntensity = (neuron.activity + connectedNeuron.activity) / 2
        const connectionOpacity = 0.1 + connectionIntensity * 0.4
        
        ctx.beginPath()
        ctx.moveTo(neuron.x, neuron.y)
        ctx.lineTo(connectedNeuron.x, connectedNeuron.y)
        ctx.strokeStyle = glowColor + connectionOpacity + ')'
        ctx.lineWidth = 1 + connectionIntensity * 2
        ctx.stroke()
      }
    })
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !onNeuronClick) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find clicked neuron
    const clickedNeuron = neuronsRef.current.find(neuron => {
      const distance = Math.sqrt(
        Math.pow(neuron.x - x, 2) + Math.pow(neuron.y - y, 2)
      )
      return distance < 15
    })

    if (clickedNeuron) {
      setSelectedNeuron(clickedNeuron)
      onNeuronClick(clickedNeuron)
      
      // Trigger activity in clicked neuron
      clickedNeuron.activity = 1
      clickedNeuron.lastActivated = Date.now()
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    setMousePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
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

    timeRef.current += 0.016 // ~60fps

    // Simulate neural activity
    simulateNeuralActivity()

    // Draw all neurons
    neuronsRef.current.forEach(neuron => {
      drawNeuron(ctx, neuron, timeRef.current)
    })

    // Draw floating particles with enhanced effects
    for (let i = 0; i < 15; i++) {
      const angle = timeRef.current * 0.008 + i * Math.PI / 7.5
      const radius = 120 + Math.sin(timeRef.current * 0.015 + i) * 40
      const x = width / 2 + Math.cos(angle) * radius
      const y = height / 2 + Math.sin(angle) * radius * 0.7

      // Enhanced particle colors based on position and activity
      const centerX = width / 2
      let particleColor = 'rgba(147, 197, 253, '
      let particleSize = 1.5

      if (x > centerX + 20) {
        particleColor = 'rgba(168, 85, 247, ' // AI side - purple
        particleSize = 2
      } else if (x < centerX - 20) {
        particleColor = 'rgba(34, 197, 94, ' // Human side - green
        particleSize = 2
      } else {
        particleColor = 'rgba(251, 191, 36, ' // Bridge - amber
        particleSize = 2.5
      }

      // Add activity-based particle effects
      const activityIntensity = aiProcessing || humanInput ? 0.8 : 0.4
      const particleOpacity = activityIntensity + Math.sin(timeRef.current * 0.03 + i) * 0.3

      ctx.beginPath()
      ctx.arc(x, y, particleSize, 0, Math.PI * 2)
      ctx.fillStyle = particleColor + particleOpacity + ')'
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [simulateNeuralActivity, aiProcessing, humanInput])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }

      // Reinitialize neurons for new size
      neuronsRef.current = initializeNeurons(rect.width, rect.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Start animation
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-transparent cursor-pointer"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      />
      
      {/* Enhanced overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-green-900/10" />
      
      {/* Activity indicators */}
      {showActivity && (aiProcessing || humanInput) && (
        <div className="absolute top-4 right-4 flex gap-2">
          {aiProcessing && (
            <motion.div
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {humanInput && (
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </div>
      )}

      {/* Selected neuron info */}
      {selectedNeuron && (
        <motion.div
          className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-semibold">
            {selectedNeuron.type === 'ai' && '🤖 AI Neuron'}
            {selectedNeuron.type === 'human' && '🧠 Human Neuron'}
            {selectedNeuron.type === 'bridge' && '🌉 Bridge Neuron'}
            {selectedNeuron.type === 'processing' && '⚡ Processing Neuron'}
          </div>
          <div>Layer: {selectedNeuron.layer}</div>
          <div>Activity: {Math.round(selectedNeuron.activity * 100)}%</div>
          <div>Connections: {selectedNeuron.connections.length}</div>
        </motion.div>
      )}

      {/* Rotating brain container with enhanced animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 3 }}
        >
          <div className="w-96 h-80 relative">
            {/* Enhanced brain silhouette */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 320"
              className="absolute inset-0"
            >
              <path
                d="M200 20 C 150 20, 100 40, 80 80 C 60 120, 70 160, 90 200 C 110 240, 140 280, 200 300 C 260 280, 290 240, 310 200 C 330 160, 340 120, 320 80 C 300 40, 250 20, 200 20 Z"
                fill="none"
                stroke="rgba(147, 197, 253, 0.1)"
                strokeWidth="2"
              />
              <path
                d="M200 20 C 150 20, 100 40, 80 80 C 60 120, 70 160, 90 200 C 110 240, 140 280, 200 300"
                fill="none"
                stroke="rgba(34, 197, 94, 0.1)"
                strokeWidth="1"
              />
              <path
                d="M200 20 C 250 20, 300 40, 320 80 C 340 120, 330 160, 310 200 C 290 240, 260 280, 200 300"
                fill="none"
                stroke="rgba(168, 85, 247, 0.1)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
