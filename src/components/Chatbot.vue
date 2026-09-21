<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { store } from '../store';

// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const STORAGE_KEY = 'ra_chat_history';

const SYSTEM_PROMPT = `
You are the "RA Smart Assistant", a professional AI consultant for 'RA Strategic & Analytics Consulting Ltd', based in Nairobi, Kenya.
Your tone is: Professional, insightful, concise, and helpful.
We specialize in 4 key pillars:
1. Research, Policy & M&E Advisory
2. Strategic Corporate Advisory
3. ICT & Data Analytics Services
4. Products & Solutions (SPSS, STATA, NVivo)
Contact details: +254-790-583-820 or info@rastrategicanalytics.com.
Your goal is to help clients understand our expertise and encourage them to book a consultation or send a message. Keep responses relatively short, well-formatted, and avoid markdown headers if possible.
`;

// --- STATE ---
const isOpen = ref(false);
const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        store.trackActivity("AI Assistant", "User opened the Chatbot window");
    }
};
const isExpanded = ref(true); 
const isTyping = ref(false);
const isStreaming = ref(false); 
const userMessage = ref('');
const messagesContainer = ref(null);

// Unbreakable ID Generator
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

const defaultGreeting = { 
    id: generateId(), 
    sender: 'bot', 
    text: 'Hello! I am the RA Smart Assistant. I can help you explore our services, case studies, or find the right strategy for your institution. How can I help you today?' 
};

const messages = ref([]);

// --- INIT & LOCAL STORAGE ---
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
        messages.value = JSON.parse(savedChat);
    } else {
        messages.value = [ { ...defaultGreeting } ];
    }
});

onUnmounted(() => { 
    window.removeEventListener('scroll', handleScroll); 
});

watch(messages, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

// --- ACTIONS ---
const clearChat = () => {
    if (confirm("Are you sure you want to clear this conversation?")) {
        messages.value = [ { ...defaultGreeting, id: generateId() } ];
        localStorage.removeItem(STORAGE_KEY);
    }
};

const parseMessage = (rawText) => {
    if (!rawText) return '';
    let html = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\* /gm, '• ');
    html = html.replace(/\n/g, '<br>');
    return html;
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const handleScroll = () => { isExpanded.value = window.scrollY < 100; };

const buildPromptHistory = () => {
    let history = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Understood. I will assist clients accordingly." }] }
    ];

    const chatMessages = messages.value.filter(m => m.sender !== 'error' && m.text.trim() !== '');
    
    chatMessages.forEach((msg) => {
        const role = msg.sender === 'user' ? 'user' : 'model';
        const lastHistory = history[history.length - 1];
        
        // Prevents API crash from consecutive identical roles
        if (lastHistory.role === role) {
            lastHistory.parts[0].text += `\n\n${msg.text}`;
        } else {
            history.push({ role, parts: [{ text: msg.text }] });
        }
    });

    return history;
};

// --- CUSTOM SMOOTH TYPING ENGINE ---
let typingQueue = [];
let isFlushingQueue = false;

const queueTextForTyping = (msgId, text) => {
    // Break incoming text into characters and push to queue
    const chars = text.split('');
    typingQueue.push(...chars);
    processTypingQueue(msgId);
};

const processTypingQueue = async (botMsgId) => {
    if (isFlushingQueue) return;
    isFlushingQueue = true;

    const msg = messages.value.find(m => m.id === botMsgId);
    if (!msg) { isFlushingQueue = false; return; }

    while (typingQueue.length > 0) {
        // Once words start appearing, kill the 3 typing dots
        if (isTyping.value) isTyping.value = false;

        const char = typingQueue.shift();
        msg.text += char;
        scrollToBottom();

        // Delay between keystrokes for smooth visual effect
        await new Promise(r => setTimeout(r, 15)); 
    }

    isFlushingQueue = false;
};

// --- SEND LOGIC ---
const sendMessage = async () => {

    
    if (!userMessage.value.trim() || isStreaming.value) return;

    store.trackActivity("AI Assistant", "User sent a message to the AI");
    
    const input = userMessage.value;
    messages.value.push({ id: generateId(), sender: 'user', text: input });
    userMessage.value = '';
    scrollToBottom();
    
    isTyping.value = true; // Show thinking dots
    isStreaming.value = true; // Lock input
    
    const botMsgId = generateId();
    // Create the empty white bubble immediately
    messages.value.push({ id: botMsgId, sender: 'bot', text: '' });

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: buildPromptHistory() })
            }
        );

        if (!response.ok) {
            throw new Error(`API Connection Failed: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let buffer = '';

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            
            if (value) {
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete lines in buffer
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6).trim();
                        if (dataStr === '[DONE]' || !dataStr) continue;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                            if (textChunk) {
                                // Feed the text chunk to our smooth typer
                                queueTextForTyping(botMsgId, textChunk);
                            }
                        } catch (e) { /* ignore JSON parse errors on partial chunks */ }
                    }
                }
            }
        }
    } catch (error) {
        console.warn("API Error caught, switching to simulated fallback.");
        const fallbackText = "I'm currently experiencing connection issues. Please reach out to our team directly via WhatsApp or the Contact page for immediate assistance.";
        // Even if it fails, simulate the typing so it looks natural!
        queueTextForTyping(botMsgId, fallbackText);
    } finally {
        // Only unlock the UI after the visual typing is completely finished
        const checkQueueInterval = setInterval(() => {
            if (typingQueue.length === 0 && !isFlushingQueue) {
                clearInterval(checkQueueInterval);
                isStreaming.value = false;
                isTyping.value = false;
                scrollToBottom();
            }
        }, 100);
    }
};
</script>

<template>
  <div class="chatbot-wrapper">
    
    <transition name="slide-up">
        <div v-if="isOpen" class="chat-window shadow-lg">
            
            <div class="chat-header bg-navy text-white d-flex justify-content-between align-items-center p-3">
                <div class="d-flex align-items-center gap-3">
                    <div class="bot-avatar bg-white text-navy fw-bold rounded-circle d-flex align-items-center justify-content-center shadow-sm">RA</div>
                    <div>
                        <h6 class="mb-0 fw-bold">RA Assistant</h6>
                        <div class="d-flex align-items-center gap-1">
                             <span class="status-dot"></span>
                             <small class="text-white-50" style="font-size: 0.75rem;">Online</small>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-1">
                    <button @click="clearChat" class="btn btn-sm text-white-50 hover-white border-0 p-1" title="Clear Chat History">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                        </svg>
                    </button>
                    <button @click="isOpen = false" class="btn btn-sm text-white-50 hover-white border-0 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="chat-body p-3 bg-light" ref="messagesContainer">
                <div v-for="msg in messages" :key="msg.id" class="d-flex mb-3" :class="msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'">
                    
                    <div v-if="msg.sender === 'user'" class="message-bubble p-3 shadow-sm bg-navy text-white rounded-user" v-html="parseMessage(msg.text)"></div>
                    
                    <div v-if="msg.sender === 'bot'" class="message-bubble p-3 shadow-sm bg-white text-dark rounded-bot border-start-gold" v-html="parseMessage(msg.text)"></div>
                    
                </div>
                
                <div v-if="isTyping" class="d-flex align-items-center gap-2 ms-2 mb-3">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>

            <div class="chat-footer p-3 bg-white border-top">
                <form @submit.prevent="sendMessage" class="d-flex gap-2 align-items-center">
                    <input v-model="userMessage" type="text" class="form-control form-control-sm rounded-pill px-3 py-2 bg-light border-0" placeholder="Type a message..." :disabled="isStreaming">
                    <button type="submit" class="btn btn-navy p-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0 send-btn" :disabled="isStreaming">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                        </svg>
                    </button>
                </form>
            </div>

        </div>
    </transition>

   <button @click="toggleChat" class="chat-toggle btn btn-navy shadow-lg rounded-pill d-flex align-items-center justify-content-center gap-2 border-0" :class="{ 'expanded': isExpanded && !isOpen }">
        <div v-if="!isOpen" class="d-flex align-items-center justify-content-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
        </div>
        <div v-else class="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>
        <span v-if="isExpanded && !isOpen" class="fw-bold pe-2 text-white">Ask AI Assistant</span>
    </button>

  </div>
</template>

<style scoped>
/* STRICT COLORS */
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }

.btn-navy { background-color: #1b2c57; color: white; transition: all 0.3s ease; }
.btn-navy:hover { background-color: #121e3a; transform: scale(1.05); }

.hover-white { transition: color 0.2s; }
.hover-white:hover { color: white !important; }

/* CHAT WINDOW */
.chatbot-wrapper { position: fixed; bottom: 30px; right: 30px; z-index: 1050; display: flex; flex-direction: column; align-items: flex-end; }
.chat-window { width: 360px; height: 500px; background: white; border-radius: 16px; overflow: hidden; margin-bottom: 20px; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.1); }
.chat-body { flex: 1; overflow-y: auto; font-size: 0.9rem; scroll-behavior: smooth; }

/* BUBBLES */
.message-bubble { max-width: 85%; line-height: 1.5; word-wrap: break-word; }
.rounded-bot { border-radius: 12px 12px 12px 2px; }
.rounded-user { border-radius: 12px 12px 2px 12px; }
.border-start-gold { border-left: 3px solid #bea429 !important; }

/* ICONS & DOTS */
.bot-avatar { width: 35px; height: 35px; font-size: 0.8rem; }
.status-dot { width: 8px; height: 8px; background-color: #2ecc71; border-radius: 50%; display: inline-block; }
.chat-toggle { height: 60px; min-width: 60px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.chat-toggle.expanded { width: auto; padding-left: 15px; padding-right: 15px; }

/* FORM */
.send-btn { width: 38px; height: 38px; }
.form-control:focus { box-shadow: none; border-color: #1b2c57; background-color: white !important; }

/* TYPING ANIMATION DOTS */
.typing-dot { width: 6px; height: 6px; background: #bea429; border-radius: 50%; animation: blink 1.4s infinite both; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }

/* TRANSITIONS */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(30px); }

/* SCROLLBAR */
.chat-body::-webkit-scrollbar { width: 6px; }
.chat-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>