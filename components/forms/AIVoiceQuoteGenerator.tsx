'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/lib/logger';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  Ruler, 
  FileText,
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';

interface VoiceInputData {
  contactName?: string;
  description?: string;
  dimensions?: string;
  images?: File[];
  audioBlob?: Blob;
}

import Image from 'next/image';

export default function AIVoiceQuoteGenerator() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [dimensions, setDimensions] = useState({ width: '', height: '', depth: '' });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'nl-NL';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }
      };
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      recognitionRef.current?.start();
      setIsRecording(true);
    } catch (error) {
      logger.error('Microphone access denied:', 'AIVoiceQuoteGenerator', { error });
      alert('Geef toegang tot je microfoon om spraak te gebruiken');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setIsRecording(false);
    
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const generateQuote = async () => {
    setIsProcessing(true);
    
    // Prepare data for AI
    const formData = new FormData();
    formData.append('transcript', transcript);
    formData.append('dimensions', JSON.stringify(dimensions));
    images.forEach((img, i) => formData.append(`image_${i}`, img));

    try {
      // Call your AI API endpoint
      const response = await fetch('/api/ai/generate-quote', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      // Handle success - redirect to quote page or show modal
      logger.info('Generated quote:', 'AIVoiceQuoteGenerator', { result });
      
    } catch (error) {
      logger.error('Error generating quote:', 'AIVoiceQuoteGenerator', { error });
      alert('Er ging iets mis bij het genereren van de offerte');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => document.getElementById('voice-modal')?.classList.toggle('hidden')}
          className="group relative h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/50 transition-all hover:shadow-cyan-500/70"
        >
          <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white" />
          
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-cyan-500"
          />
        </motion.button>
      </AnimatePresence>

      {/* Modal */}
      <div id="voice-modal" className="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">
              AI Offerte Generator
            </h2>
            <p className="text-gray-400">
              Spreek je offerte in, voeg foto&apos;s toe en laat AI het werk doen
            </p>
          </div>

          {/* Voice Recording Area */}
          <div className="mb-6">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              {/* Microphone Button */}
              <div className="mb-4 flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`relative h-20 w-20 rounded-full transition-all ${
                    isRecording
                      ? 'bg-red-500 shadow-2xl shadow-red-500/50'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/50'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white" />
                  ) : (
                    <Mic className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white" />
                  )}

                  {/* Recording animation */}
                  {isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-red-500"
                    />
                  )}
                </motion.button>
              </div>

              {/* Transcript Display */}
              <div className="min-h-[100px] rounded-xl bg-black/20 p-4">
                {transcript ? (
                  <p className="text-white">{transcript}</p>
                ) : (
                  <p className="text-center text-gray-500">
                    {isRecording ? '🎤 Aan het luisteren...' : 'Klik op de microfoon om te beginnen'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Foto&apos;s toevoegen
            </label>
            <div className="grid grid-cols-4 gap-4">
              {/* Upload Button */}
              <label className="group relative flex h-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/20 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Foto's uploaden"
                />
                <Camera className="h-6 w-6 text-gray-400 transition-colors group-hover:text-cyan-400" />
              </label>

              {/* Image Previews */}
              {images.map((img, i) => (
                <div key={i} className="relative h-24 overflow-hidden rounded-xl">
                  <Image
                    src={URL.createObjectURL(img)}
                    alt={`Upload ${i + 1}`}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-1 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dimensions Input */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Breedte (cm)</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                placeholder="100"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">Hoogte (cm)</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                placeholder="200"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">Diepte (cm)</label>
              <input
                type="number"
                value={dimensions.depth}
                onChange={(e) => setDimensions({ ...dimensions, depth: e.target.value })}
                placeholder="50"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => document.getElementById('voice-modal')?.classList.add('hidden')}
              className="flex-1 rounded-xl border border-white/10 px-6 py-3 text-white transition-all hover:bg-white/5"
            >
              Annuleren
            </button>
            <button
              onClick={generateQuote}
              disabled={isProcessing || (!transcript && images.length === 0)}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-purple-500/50 transition-all hover:shadow-purple-500/70 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Genereren...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Genereer Offerte
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
