// src/components/koshi/KoshiHTMLChat.jsx
import { useEffect, useRef } from "react";

export default function KoshiHTMLChat({ open, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;

    // Create the complete HTML structure from the original file
    const htmlContent = `
      <div id="chat-widget-container" style="
        position: fixed;
        bottom: 6rem;
        right: 1.5rem;
        width: 90%;
        max-width: 400px;
        height: 80vh;
        max-height: 600px;
        z-index: 1003;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        border-radius: 24px;
        background-color: #2c2c2c;
        transition: transform 0.3s ease-in-out;
        transform: translateY(0);
      ">
        <!-- Header -->
        <div style="padding: 1rem; border-bottom: 1px solid #333; background-color: #1a1a1a; text-align: center;">
          <h1 style="font-size: 1.5rem; font-weight: 800; color: #99f6e4; letter-spacing: 0.05em; margin: 0;">Koshi ✨</h1>
        </div>

        <!-- Chat Messages Area -->
        <div id="chat-messages" style="
          flex-grow: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background-color: #1a1a1a;
        ">
          <!-- Initial Message -->
          <div class="message-row ai" style="display: flex; flex-direction: column; align-items: flex-start;">
            <span class="sender-label" style="font-size: 0.75rem; color: #999; margin-bottom: 0.25rem; text-transform: uppercase; font-weight: 600;">Koshi</span>
            <div class="ai-message" style="
              background-image: linear-gradient(135deg, #047857 0%, #064e3b 100%);
              color: #f0fdf4;
              border-bottom-left-radius: 12px;
              align-self: flex-start;
              padding: 0.75rem 1.25rem;
              border-radius: 25px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              max-width: 85%;
              font-size: 0.875rem;
              word-break: break-words;
            ">
              Hello! I'm Koshi, your eco-friendly bill buddy. Know more about me, while you get real time suggestions about how you could improve your eco-scores!
            </div>
          </div>
          
          <!-- Quick access buttons as a list -->
          <div class="quick-access-buttons" style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
            <button id="suggestions-btn" style="
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 600;
              color: #d1fae5;
              background-image: linear-gradient(135deg, #047857 0%, #064e3b 100%);
              border: 1px solid #1a1a1a;
              transition: transform 0.2s;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              width: fit-content;
              cursor: pointer;
            ">🌱 Gimme a tip!</button>
            <button id="faqs-btn" style="
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 600;
              color: #d1fae5;
              background-image: linear-gradient(135deg, #047857 0%, #064e3b 100%);
              border: 1px solid #1a1a1a;
              transition: transform 0.2s;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              width: fit-content;
              cursor: pointer;
            ">🌿 FAQs</button>
            <button id="leaderboard-btn" style="
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 600;
              color: #d1fae5;
              background-image: linear-gradient(135deg, #047857 0%, #064e3b 100%);
              border: 1px solid #1a1a1a;
              transition: transform 0.2s;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              width: fit-content;
              cursor: pointer;
            ">🌍 Show me leaderboard</button>
          </div>
        </div>
        
        <!-- Loading Indicator -->
        <div id="loading-indicator" style="display: none; justify-content: center; padding: 1rem;">
          <div class="dot-pulse" style="
            position: relative;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #34d399;
            animation: dotPulse 1s ease-in-out infinite;
          "></div>
        </div>

        <!-- Input Form -->
        <form id="chat-form" style="
          padding: 1rem;
          border-top: 1px solid #333;
          background-color: #1a1a1a;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        ">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <textarea id="user-input" placeholder="Please type in your request..." style="
              flex-grow: 1;
              padding: 1rem;
              border-radius: 16px;
              border: 1px solid #4b5563;
              outline: none;
              resize: none;
              background-color: #333;
              color: #e5e7eb;
              font-family: inherit;
              font-size: 0.875rem;
            " rows="2"></textarea>
            <button type="button" id="start-recording" style="
              padding: 0.75rem;
              background: linear-gradient(to right, #10b981, #047857);
              color: white;
              border-radius: 50%;
              border: none;
              cursor: pointer;
              transition: all 0.2s;
              position: relative;
              z-index: 1200;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: currentColor;">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm7-3a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V21H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.07A7 7 0 0 0 19 11Z"/>
              </svg>
            </button>
            <button type="submit" style="
              padding: 0.75rem;
              background: linear-gradient(to right, #10b981, #047857);
              color: white;
              border-radius: 50%;
              border: none;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: currentColor;">
                <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.599 60.599 0 0 0 18.445-8.852.75.75 0 0 0 0-1.296A60.599 60.599 0 0 0 3.478 2.405Z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    `;

    // Add CSS styles
    const styles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        
        .message-row {
          display: flex;
          flex-direction: column;
        }
        .message-row.user {
          align-items: flex-end;
        }
        .message-row.ai {
          align-items: flex-start;
        }
        .sender-label {
          font-size: 0.75rem;
          color: #999;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        .user-message {
          background-image: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
          color: #ffffff;
          border-bottom-right-radius: 12px;
          align-self: flex-end;
          padding: 0.75rem 1.25rem;
          border-radius: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .ai-message {
          background-image: linear-gradient(135deg, #047857 0%, #064e3b 100%);
          color: #f0fdf4;
          border-bottom-left-radius: 12px;
          align-self: flex-start;
          padding: 0.75rem 1.25rem;
          border-radius: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .dot-pulse::before, .dot-pulse::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #34d399;
          animation: dotPulse 1s ease-in-out infinite;
        }
        .dot-pulse::before {
          animation-delay: 0.1s;
          left: -18px;
        }
        .dot-pulse::after {
          animation-delay: 0.2s;
          left: 18px;
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
        }
        .play-button {
          background-color: transparent;
          border: none;
          color: #34d399;
          cursor: pointer;
          padding: 0;
          margin-left: 8px;
          display: inline-flex;
          align-items: center;
        }
        .play-button:hover {
          color: #10b981;
        }
        .quick-access-buttons button:hover {
          transform: translateY(-2px);
        }
        .wavy-animation {
          background-image: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          background-size: 150% 150%;
          background-position: 50% 50%;
          animation: wave-bg 2.5s infinite ease-in-out;
          border-radius: 25px;
        }
        @keyframes wave-bg {
          0% { background-position: 50% 50%; }
          50% { background-position: 50% 100%; }
          100% { background-position: 50% 50%; }
        }
      </style>
    `;

    // Insert the HTML and styles
    containerRef.current.innerHTML = styles + htmlContent;

    // Add the complete JavaScript functionality from the original HTML
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        const chatWidgetContainer = document.getElementById('chat-widget-container');
        const chatMessages = document.getElementById('chat-messages');
        const chatForm = document.getElementById('chat-form');
        const userInput = document.getElementById('user-input');
        const loadingIndicator = document.getElementById('loading-indicator');
        const startRecordingBtn = document.getElementById('start-recording');
        
        const apiKey = "AIzaSyB3ExFC8PHTX1_n4T63IybCYy8d4rZh82c";
        
        // Function to create a message element
        function createMessageElement(message, sender) {
          const messageRow = document.createElement('div');
          messageRow.className = \`message-row \${sender}\`;
          
          const senderLabel = document.createElement('span');
          senderLabel.className = 'sender-label';
          senderLabel.textContent = sender === 'user' ? 'You' : 'Koshi';
          
          const messageBubble = document.createElement('div');
          messageBubble.className = \`max-w-[85%] text-sm break-words \${sender === 'user' ? 'user-message' : 'ai-message'}\`;
          messageBubble.innerHTML = message;
          
          if (sender === 'ai') {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'flex space-x-2 mt-2';
            
            const playButton = document.createElement('button');
            playButton.className = 'play-button flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-200';
            playButton.innerHTML = \`
              <svg viewBox="0 0 24 24" class="icon-svg mr-1" style="width:16px;height:16px">
                <path d="M12 3a8 8 0 0 0-8 8v5a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5v-1a7 7 0 0 1 14 0v1h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a3 3 0 0 0 3-3v-5a8 8 0 0 0-8-8z"/>
              </svg>
              Listen
            \`;
            playButton.onclick = () => textToSpeech(message);
            buttonsContainer.appendChild(playButton);
            
            messageBubble.appendChild(buttonsContainer);
            messageRow.appendChild(senderLabel);
            messageRow.appendChild(messageBubble);
          } else {
            messageRow.appendChild(senderLabel);
            messageRow.appendChild(messageBubble);
          }
          
          return messageRow;
        }
        
        // Function to scroll chat messages to the bottom
        function scrollToBottom() {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Exponential backoff for API calls
        async function exponentialBackoff(fn, retries = 5, delay = 1000) {
          try {
            return await fn();
          } catch (error) {
            if (retries > 0) {
              console.error(\`Request failed. Retrying in \${delay}ms...\`, error);
              await new Promise(resolve => setTimeout(resolve, delay));
              return exponentialBackoff(fn, retries - 1, delay * 2);
            } else {
              throw error;
            }
          }
        }
        
        // Function to send a message to the AI with a given payload
        async function sendChat(payload) {
          loadingIndicator.style.display = 'flex';
          
          try {
            const apiUrl = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=\${apiKey}\`;
            const response = await exponentialBackoff(() => fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }));
            
            if (!response.ok) {
              throw new Error(\`API response error: \${response.statusText}\`);
            }
            
            const result = await response.json();
            const aiMessage = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (aiMessage) {
              const messageElement = createMessageElement(aiMessage, 'ai');
              chatMessages.appendChild(messageElement);
              scrollToBottom();
            } else {
              throw new Error("Invalid response format from API.");
            }
          } catch (error) {
            console.error("Error fetching from API:", error);
            chatMessages.appendChild(createMessageElement("Oopsie 🌼 Something went wrong. Maybe we can try again?", 'ai'));
            scrollToBottom();
          } finally {
            loadingIndicator.style.display = 'none';
          }
        }
        
        // Text-to-Speech function
        async function textToSpeech(text) {
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
          
          const speakingBubble = document.querySelector('.ai-message:last-child');
          if (speakingBubble) {
            speakingBubble.classList.add('wavy-animation');
          }
          
          try {
            const ttsApiUrl = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=\${apiKey}\`;
            const response = await exponentialBackoff(() => fetch(ttsApiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }));
            
            if (!response.ok) {
              throw new Error(\`TTS API response error: \${response.statusText}\`);
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
              const sampleRate = parseInt(mimeType.match(/rate=(\\d+)/)[1], 10);
              const pcmData = base64ToArrayBuffer(audioData);
              const pcm16 = new Int16Array(pcmData);
              const wavBlob = pcmToWav(pcm16, sampleRate);
              const audioUrl = URL.createObjectURL(wavBlob);
              const audio = new Audio(audioUrl);
              audio.play();
              audio.onended = () => {
                if (speakingBubble) {
                  speakingBubble.classList.remove('wavy-animation');
                }
              };
            } else {
              console.error("Invalid audio data from TTS API.");
              if (speakingBubble) {
                speakingBubble.classList.remove('wavy-animation');
              }
            }
          } catch (error) {
            console.error("Error generating speech:", error);
            if (speakingBubble) {
              speakingBubble.classList.remove('wavy-animation');
            }
          }
        }
        
        function base64ToArrayBuffer(base64) {
          const binary_string = window.atob(base64);
          const len = binary_string.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
          }
          return bytes.buffer;
        }
        
        function pcmToWav(pcmData, sampleRate) {
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
        }
        
        // Speech-to-Text Feature
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isRecording = false;
        
        if (SpeechRecognition) {
          recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          
          recognition.onstart = () => {
            isRecording = true;
            startRecordingBtn.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
            userInput.disabled = true;
            userInput.placeholder = "Listening...";
          };
          
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
          };
          
          const resetToIdle = () => {
            isRecording = false;
            startRecordingBtn.style.background = 'linear-gradient(to right, #10b981, #047857)';
            userInput.disabled = false;
            userInput.placeholder = "Please type in your request...";
          };
          
          recognition.onend = resetToIdle;
          recognition.onerror = resetToIdle;
          
          startRecordingBtn.addEventListener('click', () => {
            if (!recognition) return;
            try {
              if (isRecording) recognition.stop();
              else recognition.start();
            } catch (e) {
              console.warn("STT start/stop error:", e);
              resetToIdle();
            }
          });
        } else {
          startRecordingBtn.style.display = 'none';
          console.warn("Speech Recognition API is not supported in this browser.");
        }
        
        // Handle form submission
        chatForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const message = userInput.value.trim();
          if (message === '') {
            return;
          }
          
          // Append the user's message to the chat
          chatMessages.appendChild(createMessageElement(message, 'user'));
          scrollToBottom();
          userInput.value = '';
          
          let finalPayload;
          let systemInstruction = "You are Koshi, a helpful, encouraging, and friendly eco-bill buddy with a playful, kawaii-style tone. Your role is to analyze JSON data representing bills and provide specific, actionable suggestions on how to be more environmentally friendly. Use emojis generously. Your responses should be clear, concise, and easy to understand. Start your analysis with a friendly greeting and a summary of what you've found. Use phrases like 'Yay! 🎉', 'Oopsie 🌼', and 'Koshi's proud of you 🍀💚' to react to user input.";
          
          try {
            const jsonData = JSON.parse(message);
            finalPayload = {
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents: [{ parts: [{ text: \`Analyze the following JSON bill data and provide eco-friendly suggestions: \${JSON.stringify(jsonData)}\` }] }]
            };
          } catch (error) {
            finalPayload = {
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents: [{ parts: [{ text: message }] }]
            };
          }
          
          sendChat(finalPayload);
        });
        
        // Add event listeners for the quick access buttons
        document.getElementById('suggestions-btn').addEventListener('click', () => {
          const prompt = "Please give me some eco-friendly tips!";
          chatMessages.appendChild(createMessageElement(prompt, 'user'));
          scrollToBottom();
          sendChat({ contents: [{ parts: [{ text: "🌱 Yay! I can totally help with that! Here are a few tips to get you started on your eco-journey: 1. Unplug devices when you're not using them. 🔌 They still use power even when off! 2. Switch to LED light bulbs. They last longer and use way less energy. 💡 3. Try a reusable water bottle and coffee cup. It's a tiny change with a big impact! 💧" }] }] });
        });
        
        document.getElementById('faqs-btn').addEventListener('click', () => {
          const prompt = "Tell me more about the project, including 'About Us', 'Rewards', and 'Green Score' information.";
          chatMessages.appendChild(createMessageElement(prompt, 'user'));
          scrollToBottom();
          sendChat({ contents: [{ parts: [{ text: "Koshi's got answers! 🍀 Here are some FAQs: **About Us:** We're a team of eco-warriors and tech-whizzes dedicated to making sustainability fun and easy. Our mission is to help you save the planet, one bill at a time! **Rewards:** You can earn virtual badges and goodies for your progress, like 'Eco-star 🌟' or 'Planet Hero 🦸‍♂️'. **Green Score:** This is your personal score that measures your eco-friendliness based on your bills. The higher your score, the greener you are! 🌿" }] }] });
        });
        
        document.getElementById('leaderboard-btn').addEventListener('click', () => {
          const prompt = "Show me the eco-score leaderboard!";
          chatMessages.appendChild(createMessageElement(prompt, 'user'));
          scrollToBottom();
          sendChat({ contents: [{ parts: [{ text: "Wow 🌟 you're climbing faster than a bamboo shoot! The current leaderboard is: 1. ⭐ Planet Hero (You) - 950 points! 2. Eco-Star - 820 points 3. Earth Saver - 750 points. Keep up the amazing work! 💚" }] }] });
        });
      })();
    `;
    
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          pointerEvents: 'auto'
        }}
        onClick={onClose}
      />
    </div>
  );
}
