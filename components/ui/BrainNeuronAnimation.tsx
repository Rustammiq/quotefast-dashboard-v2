'use client'

import React, { useEffect, useRef } from 'react'

export default function BrainNeuronAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawNeuralNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3
      
      // Draw nodes
      const nodes = 8
      for (let i = 0; i < nodes; i++) {
        const angle = (i / nodes) * Math.PI * 2 + time * 0.001
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // Node glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20)
        gradient.addColorStop(0, 'rgba(94, 139, 255, 0.8)')
        gradient.addColorStop(1, 'rgba(94, 139, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, Math.PI * 2)
        ctx.fill()
        
        // Node core
        ctx.fillStyle = 'rgba(94, 139, 255, 0.9)'
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Draw connections
      ctx.strokeStyle = 'rgba(94, 139, 255, 0.3)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < nodes; i++) {
        for (let j = i + 1; j < nodes; j++) {
          const angle1 = (i / nodes) * Math.PI * 2 + time * 0.001
          const angle2 = (j / nodes) * Math.PI * 2 + time * 0.001
          
          const x1 = centerX + Math.cos(angle1) * radius
          const y1 = centerY + Math.sin(angle1) * radius
          const x2 = centerX + Math.cos(angle2) * radius
          const y2 = centerY + Math.sin(angle2) * radius
          
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
      
      time += 16
      animationId = requestAnimationFrame(drawNeuralNetwork)
    }

    resizeCanvas()
    drawNeuralNetwork()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-transparent opacity-60"
      style={{ pointerEvents: 'none' }}
    />
  )
}
