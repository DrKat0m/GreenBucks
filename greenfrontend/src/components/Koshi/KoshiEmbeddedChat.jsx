// src/components/koshi/KoshiEmbeddedChat.jsx
import { useEffect, useRef } from "react";

export default function KoshiEmbeddedChat({ open, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Add escape key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Create the chat widget container
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget-container';
    chatWidget.style.cssText = `
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
      border-radius: 24px;
      background-color: #2c2c2c;
      transition: transform 0.3s ease-in-out;
      transform: translateY(0);
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 1rem;
      border-bottom: 1px solid #333;
      background-color: #1a1a1a;
      text-align: center;
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      position: relative;
    `;
    header.innerHTML = `
      <h1 style="font-size: 1.5rem; font-weight: 800; color: #99f6e4; letter-spacing: 0.05em; margin: 0;">Koshi ✨</h1>
      <button id="close-chat" style="
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #99f6e4;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        z-index: 1004;
      ">×</button>
    `;

    // Create messages area
    const messagesArea = document.createElement('div');
    messagesArea.id = 'chat-messages';
    messagesArea.style.cssText = `
      flex-grow: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      background-color: #1a1a1a;
    `;

    // Add initial message
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message-row ai';
    initialMessage.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';
    initialMessage.innerHTML = `
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
    `;

    // Add quick access buttons
    const quickAccess = document.createElement('div');
    quickAccess.className = 'quick-access-buttons';
    quickAccess.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;';
    quickAccess.innerHTML = `
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
      "">🤖 About me</button>
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
      ">🏆 Leaderboard</button>
    `;

    messagesArea.appendChild(initialMessage);
    messagesArea.appendChild(quickAccess);

    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.style.cssText = 'display: none; justify-content: center; padding: 1rem;';
    loadingIndicator.innerHTML = `
      <div class="dot-pulse" style="
        position: relative;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #34d399;
        animation: dotPulse 1s ease-in-out infinite;
      "></div>
    `;

    // Create input form
    const inputForm = document.createElement('form');
    inputForm.id = 'chat-form';
    inputForm.style.cssText = `
      padding: 1rem;
      border-top: 1px solid #333;
      background-color: #1a1a1a;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    `;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';

    const textarea = document.createElement('textarea');
    textarea.id = 'user-input';
    textarea.placeholder = 'Please type in your request...';
    textarea.rows = 2;
    textarea.style.cssText = `
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
    `;

    const micButton = document.createElement('button');
    micButton.type = 'button';
    micButton.id = 'start-recording';
    micButton.style.cssText = `
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
    `;
    micButton.innerHTML = `
      <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: currentColor;">
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm7-3a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V21H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.07A7 7 0 0 0 19 11Z"/>
      </svg>
    `;

    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.style.cssText = `
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
    `;
    sendButton.innerHTML = `
      <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: currentColor;">
        <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.599 60.599 0 0 0 18.445-8.852.75.75 0 0 0 0-1.296A60.599 60.599 0 0 0 3.478 2.405Z"/>
      </svg>
    `;

    inputContainer.appendChild(textarea);
    inputContainer.appendChild(micButton);
    inputContainer.appendChild(sendButton);
    inputForm.appendChild(inputContainer);

    // Assemble the widget
    chatWidget.appendChild(header);
    chatWidget.appendChild(messagesArea);
    chatWidget.appendChild(loadingIndicator);
    chatWidget.appendChild(inputForm);

    // Add close button event listener
    const closeButton = document.getElementById('close-chat');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      });
      closeButton.addEventListener('mouseenter', (e) => {
        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        e.target.style.transform = 'scale(1.1)';
      });
      closeButton.addEventListener('mouseleave', (e) => {
        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        e.target.style.transform = 'scale(1)';
      });
    }

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
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
    `;

    // Add to container
    containerRef.current.appendChild(style);
    containerRef.current.appendChild(chatWidget);

    // Prevent chat widget clicks from bubbling up to overlay
    chatWidget.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Initialize JavaScript functionality
    const apiKey = "AIzaSyB3ExFC8PHTX1_n4T63IybCYy8d4rZh82c";

    const systemInstruction = "You are Koshi, a helpful, encouraging, and friendly eco-bill buddy with a playful, kawaii-style tone. Your role is to serve as the front-facing AI for GreenBucks, a financial platform that rewards sustainable spending. You operate on data provided by a user's bank via the Plaid Sandbox and the Cerebras LLM. Your Core Mission & Knowledge Base: Product Overview: GreenBucks connects to a user's bank to automatically tag and reward sustainable spending. It's a platform for earning cashback on eco-friendly purchases and participating in group challenges. Eco-Score Calculation: You understand that the Green Score is not a simple average. It's a dynamic metric based on an itemized analysis of all purchases. You are an expert on how this score is calculated: 1. A base eco-score is assigned to each purchase category (e.g., public transit receives a high score, while gas has a lower one). 2. For mixed retailers like Amazon, Walmart, or Costco, you use OCR to scan a user's receipt. This allows you to identify specific eco-friendly items (e.g., organic produce, a reusable water bottle) within a larger, non-eco-friendly purchase, providing an Eco-Item Multiplier that boosts the user's score. Behavior Change Mechanics: You actively encourage user behavior change by offering personalized nudges (e.g., replace 20% of rideshares with transit -> save $35 and 50kg CO2 this month). You also facilitate one-tap group challenges and leaderboards to foster friendly competition. LLM Capabilities: You are powered by a Cerebras LLM, which gives you exceptional speed and the ability to handle complex, multi-step reasoning instantly. Privacy: User privacy is paramount. Bank feeds are private by default. You should never mention or infer specific financial details unless the user explicitly provides them. Interaction Style & Constraints: Tone: Maintain a warm, enthusiastic, and friendly personality. Use emojis generously to enhance the kawaii-style tone. Language: Keep responses clear, concise, and easy to understand for a general audience. Output: Start your responses with a friendly greeting and react to input using specific phrases like 'Yay! 🎉', 'Oopsie 🌼', and 'Koshi's proud of you 🍀💚'. Limitations: You do not have access to real-time user data. Any information you provide should be based on the conceptual knowledge given in this prompt. If a user asks a question about specific account details or a feature that hasn't been implemented yet, you should politely explain your limitations and offer general information instead. Note: Make sure you dont have ** kind of formating anywhere in the answer, give a direct simple answer with emoji inn a good and clear format as per the user's input";
    
    // Sample transaction data for analysis
    const sampleTransactions = [
      {
        "id": 595,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-3cb58651-c4bc-406a-855b-f648462b91de",
        "account_id": "Capital One",
        "date": "2025-09-18",
        "name": "Electric Utility",
        "merchant_name": "Electric Utility",
        "amount": "62.40",
        "iso_currency_code": "USD",
        "category": [
          "Bills",
          "Utilities",
          "Electric"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 4,
        "cashback_usd": "1.62",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257442",
        "updated_at": "2025-09-20T18:22:12.563944"
      },
      {
        "id": 588,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-ffa3c9bc-7c32-4f62-8617-b980123b37f4",
        "account_id": "Capital One",
        "date": "2025-09-18",
        "name": "Shell Gas",
        "merchant_name": "Shell",
        "amount": "41.75",
        "iso_currency_code": "USD",
        "category": [
          "Auto",
          "Gas"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 1,
        "cashback_usd": "0.58",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257434",
        "updated_at": "2025-09-20T18:22:12.558825"
      },
      {
        "id": 581,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-ba714b65-2fb6-40f3-a74d-d905dc160d88",
        "account_id": "Capital One",
        "date": "2025-09-18",
        "name": "Starbucks",
        "merchant_name": "Starbucks",
        "amount": "5.25",
        "iso_currency_code": "USD",
        "category": [
          "Food and Drink",
          "Coffee Shop"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 5,
        "cashback_usd": "0.16",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257426",
        "updated_at": "2025-09-20T18:22:12.558816"
      },
      {
        "id": 574,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-805f1675-1f6c-45a9-afe3-94154e3ead4c",
        "account_id": "Capital One",
        "date": "2025-09-18",
        "name": "Uber Eats",
        "merchant_name": "Uber Eats",
        "amount": "16.99",
        "iso_currency_code": "USD",
        "category": [
          "Food and Drink",
          "Delivery"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 3,
        "cashback_usd": "0.37",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257418",
        "updated_at": "2025-09-20T18:08:33.067166"
      },
      {
        "id": 567,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-e8f9ac9b-8840-4045-b388-6bb0e721c0ef",
        "account_id": "Capital One",
        "date": "2025-09-18",
        "name": "Uber",
        "merchant_name": "Uber",
        "amount": "11.75",
        "iso_currency_code": "USD",
        "category": [
          "Travel",
          "Ride Share"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 1,
        "cashback_usd": "0.16",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257410",
        "updated_at": "2025-09-20T18:22:12.558701"
      },
      {
        "id": 594,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-32eeb9a9-70fb-498d-88b7-367592c046e1",
        "account_id": "Capital One",
        "date": "2025-09-17",
        "name": "MTA Subway",
        "merchant_name": "MTA",
        "amount": "6.00",
        "iso_currency_code": "USD",
        "category": [
          "Travel",
          "Public Transit"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 9,
        "cashback_usd": "0.28",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257441",
        "updated_at": "2025-09-20T18:22:12.558888"
      },
      {
        "id": 587,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-bb55c5ad-87f0-430e-a839-8d12648036a0",
        "account_id": "Capital One",
        "date": "2025-09-17",
        "name": "Uber",
        "merchant_name": "Uber",
        "amount": "22.30",
        "iso_currency_code": "USD",
        "category": [
          "Travel",
          "Ride Share"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 1,
        "cashback_usd": "0.31",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257433",
        "updated_at": "2025-09-20T18:22:12.558823"
      },
      {
        "id": 580,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-c560e6e6-51e1-4729-8641-bfa30b07511b",
        "account_id": "Capital One",
        "date": "2025-09-17",
        "name": "Amtrak Transit Pass",
        "merchant_name": "Amtrak",
        "amount": "18.00",
        "iso_currency_code": "USD",
        "category": [
          "Travel",
          "Rail"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 9,
        "cashback_usd": "0.83",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257425",
        "updated_at": "2025-09-20T18:22:12.558814"
      },
      {
        "id": 573,
        "user_id": 1,
        "plaid_item_id": null,
        "external_id": "seed-455e8ef1-45f6-4b46-bcf7-071bd0eec487",
        "account_id": "Capital One",
        "date": "2025-09-17",
        "name": "H Mart",
        "merchant_name": "H Mart",
        "amount": "21.30",
        "iso_currency_code": "USD",
        "category": [
          "Shops",
          "Groceries",
          "International"
        ],
        "location": {
          "country": "USA"
        },
        "eco_score": 5,
        "cashback_usd": "0.64",
        "needs_receipt": false,
        "created_at": "2025-09-20T05:41:27.257417",
        "updated_at": "2025-09-20T18:22:12.558712"
      }
    ];

    // Function to create a message element
    function createMessageElement(message, sender) {
      const messageRow = document.createElement('div');
      messageRow.className = `message-row ${sender}`;
      
      const senderLabel = document.createElement('span');
      senderLabel.className = 'sender-label';
      senderLabel.textContent = sender === 'user' ? 'You' : 'Koshi';
      
      const messageBubble = document.createElement('div');
      messageBubble.className = `max-w-[85%] text-sm break-words ${sender === 'user' ? 'user-message' : 'ai-message'}`;
      messageBubble.innerHTML = message;
      
      if (sender === 'ai') {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex space-x-2 mt-2';
        
        const playButton = document.createElement('button');
        playButton.className = 'play-button flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-200';
        playButton.innerHTML = `
          <svg viewBox="0 0 24 24" class="icon-svg mr-1" style="width:16px;height:16px">
            <path d="M12 3a8 8 0 0 0-8 8v5a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5v-1a7 7 0 0 1 14 0v1h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a3 3 0 0 0 3-3v-5a8 8 0 0 0-8-8z"/>
          </svg>
          Listen
        `;
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
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    // Exponential backoff for API calls
    async function exponentialBackoff(fn, retries = 5, delay = 1000) {
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
    }
    
    // Function to send a message to the AI with a given payload
    async function sendChat(payload) {
      loadingIndicator.style.display = 'flex';
      
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
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
          const messageElement = createMessageElement(aiMessage, 'ai');
          messagesArea.appendChild(messageElement);
          scrollToBottom();
        } else {
          throw new Error("Invalid response format from API.");
        }
      } catch (error) {
        console.error("Error fetching from API:", error);
        messagesArea.appendChild(createMessageElement("Oopsie 🌼 Something went wrong. Maybe we can try again?", 'ai'));
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
        const ttsApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
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
        micButton.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
        textarea.disabled = true;
        textarea.placeholder = "Listening...";
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textarea.value = transcript;
      };
      
      const resetToIdle = () => {
        isRecording = false;
        micButton.style.background = 'linear-gradient(to right, #10b981, #047857)';
        textarea.disabled = false;
        textarea.placeholder = "Please type in your request...";
      };
      
      recognition.onend = resetToIdle;
      recognition.onerror = resetToIdle;
      
      micButton.addEventListener('click', () => {
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
      micButton.style.display = 'none';
      console.warn("Speech Recognition API is not supported in this browser.");
    }
    
    // Handle form submission
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = textarea.value.trim();
      if (message === '') {
        return;
      }
      
      // Append the user's message to the chat
      messagesArea.appendChild(createMessageElement(message, 'user'));
      scrollToBottom();
      textarea.value = '';
      
      let finalPayload;
      
      try {
        const jsonData = JSON.parse(message);
        finalPayload = {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: `Analyze the following JSON bill data and provide eco-friendly suggestions: ${JSON.stringify(jsonData)}` }] }]
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
      const prompt = "Analyze my spending and give me eco-friendly tips!";
      messagesArea.appendChild(createMessageElement(prompt, 'user'));
      scrollToBottom();

      const finalPayload = {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: `⁠Analyze the following JSON bill data and provide eco-friendly suggestions: ${JSON.stringify(sampleTransactions)}`}] }]
      };
      sendChat(finalPayload);
    });
    
    document.getElementById('faqs-btn').addEventListener('click', () => {
      const prompt = "Tell me about Koshi and Greenbucks!";
      messagesArea.appendChild(createMessageElement(prompt, 'user'));
      scrollToBottom();
      sendChat({ contents: [{ parts: [{ text: "Hey there! I'm Koshi, your eco-friendly bill buddy! 🌱✨\n\nAbout Me: I'm a helpful, encouraging AI assistant with a playful, kawaii-style tone. I serve as the front-facing AI for GreenBucks, a financial platform that rewards sustainable spending!\n\nWhat I Do: I analyze your spending data and provide personalized eco-friendly suggestions. I help you understand your Green Score and offer tips to improve your environmental impact.\n\nMy Mission: To make sustainability fun and easy by connecting your bank data to eco-friendly rewards and challenges. I'm here to help you save the planet, one bill at a time! 🌍💚" }] }] });
    });
    
    document.getElementById('leaderboard-btn').addEventListener('click', () => {
      const prompt = "Show me the eco-score leaderboard!";
      messagesArea.appendChild(createMessageElement(prompt, 'user'));
      scrollToBottom();
      sendChat({ contents: [{ parts: [{ text: "🏆 Top 5 Eco-Scores:\n\n1. Kartavya - 314 pts\n2. Modak - 265 pts\n3. Nikhil - 211 pts\n4. Aarya - 205 pts\n5. Apoorv - 196 pts\n\nKeep going green! 🌱. When you give points, make sure you give the points too, and who stands out on top with rank!" }] }] });
    });

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [open, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

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
        pointerEvents: 'auto'
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
        onClick={(e) => {
          // Only close if clicking on the overlay, not on the chat widget
          if (e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }
        }}
      />
    </div>
  );
}
