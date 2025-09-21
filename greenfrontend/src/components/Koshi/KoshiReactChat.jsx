// src/components/Koshi/KoshiReactChat.jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2 } from 'lucide-react';

const GEMINI_API_KEY = "AIzaSyB3ExFC8PHTX1_n4T63IybCYy8d4rZh82c";

export default function KoshiReactChat({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Koshi, your eco-friendly bill buddy. Know more about me, while you get real time suggestions about how you could improve your eco-scores!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsRecording(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      recognitionInstance.onerror = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  // Exponential backoff for API calls
  const exponentialBackoff = async (fn, retries = 5, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.error(`Request failed. Retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return exponentialBackoff(fn, retries - 1, delay * 2);
      } else {
        throw error;
      }
    }
  };

  // Send message to Gemini API
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const systemInstruction = "You are Koshi, a helpful, encouraging, and friendly eco-bill buddy with a playful, kawaii-style tone. Your role is to analyze JSON data representing bills and provide specific, actionable suggestions on how to be more environmentally friendly. Use emojis generously. Your responses should be clear, concise, and easy to understand. Start your analysis with a friendly greeting and a summary of what you've found. Use phrases like 'Yay! 🎉', 'Oopsie 🌼', and 'Koshi's proud of you 🍀💚' to react to user input.";

      let payload;
      try {
        const jsonData = JSON.parse(messageText);
        payload = {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: `Analyze the following JSON bill data and provide eco-friendly suggestions: ${JSON.stringify(jsonData)}` }] }]
        };
      } catch (error) {
        payload = {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: messageText }] }]
        };
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await exponentialBackoff(() => fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }));

      if (!response.ok) {
        throw new Error(`API response error: ${response.statusText}`);
      }

      const result = await response.json();
      const aiMessage = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiMessage) {
        const aiResponse = {
          id: Date.now() + 1,
          text: aiMessage,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error("Invalid response format from API.");
      }
    } catch (error) {
      console.error("Error fetching from API:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Oopsie 🌼 Something went wrong. Maybe we can try again?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-Speech function
  const textToSpeech = async (text) => {
    const payload = {
      contents: [{ parts: [{ text: text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Leda" }
          }
        }
      },
      model: "gemini-2.5-flash-preview-tts"
    };

    try {
      const ttsApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`;
      const response = await exponentialBackoff(() => fetch(ttsApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }));

      if (!response.ok) {
        throw new Error(`TTS API response error: ${response.statusText}`);
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Empty response body from TTS API.");
      }

      const result = JSON.parse(responseText);
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/")) {
        const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error("Invalid audio data from TTS API.");
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  // Helper functions for audio processing
  const base64ToArrayBuffer = (base64) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const pcmToWav = (pcmData, sampleRate) => {
    const pcmBuffer = pcmData.buffer;
    const numChannels = 1;
    const bitDepth = 16;
    const byteRate = sampleRate * numChannels * bitDepth / 8;
    const blockAlign = numChannels * bitDepth / 8;
    const dataSize = pcmBuffer.byteLength;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    let offset = 0;
    function writeString(str) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    }

    // RIFF header
    writeString('RIFF');
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    writeString('WAVE');

    // FMT sub-chunk
    writeString('fmt ');
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitDepth, true);
    offset += 2;

    // DATA sub-chunk
    writeString('data');
    view.setUint32(offset, dataSize, true);
    offset += 4;

    // Write PCM data
    const pcmView = new Int16Array(pcmBuffer);
    for (let i = 0; i < pcmView.length; i++) {
      view.setInt16(offset, pcmView[i], true);
      offset += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Handle voice recording
  const handleVoiceRecording = () => {
    if (!recognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    try {
      if (isRecording) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } catch (e) {
      console.warn("STT start/stop error:", e);
      setIsRecording(false);
    }
  };

  // Handle quick action buttons
  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'tips':
        message = "Please give me some eco-friendly tips!";
        break;
      case 'faqs':
        message = "Tell me more about the project, including 'About Us', 'Rewards', and 'Green Score' information.";
        break;
      case 'leaderboard':
        message = "Show me the eco-score leaderboard!";
        break;
      default:
        return;
    }
    sendMessage(message);
  };

  // Handle textarea auto-resize
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-end p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30" 
        onClick={onClose}
      />
      
      {/* Chat Container */}
      <div className="relative w-full max-w-md h-[80vh] max-h-[600px] bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 text-center border-b border-gray-700">
          <h1 className="text-xl font-bold text-teal-300 tracking-wide">Koshi ✨</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-900">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-xs text-gray-400 mb-1 uppercase font-semibold">
                {message.sender === 'user' ? 'You' : 'Koshi'}
              </span>
              <div 
                className={`max-w-[85%] px-4 py-3 rounded-3xl text-sm break-words ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-br-lg' 
                    : 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-emerald-50 rounded-bl-lg'
                }`}
              >
                {message.text}
                {message.sender === 'ai' && (
                  <button
                    onClick={() => textToSpeech(message.text)}
                    className="ml-2 p-1 text-emerald-300 hover:text-emerald-100 transition-colors"
                    title="Listen"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Quick Action Buttons */}
          {messages.length === 1 && (
            <div className="flex flex-col space-y-2 mt-4">
              <button
                onClick={() => handleQuickAction('tips')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-emerald-100 rounded-full text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5 w-fit"
              >
                🌱 Gimme a tip!
              </button>
              <button
                onClick={() => handleQuickAction('faqs')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-emerald-100 rounded-full text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5 w-fit"
              >
                🌿 FAQs
              </button>
              <button
                onClick={() => handleQuickAction('leaderboard')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-emerald-100 rounded-full text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5 w-fit"
              >
                🌍 Show me leaderboard
              </button>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-700">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Listening..." : "Please type in your request..."}
                disabled={isRecording}
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-2xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px]"
                rows="1"
              />
            </div>
            
            {recognition && (
              <button
                type="button"
                onClick={handleVoiceRecording}
                className={`p-3 rounded-full transition-all ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500'
                }`}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                <Mic size={20} />
              </button>
            )}
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
