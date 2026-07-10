import { useState, useRef, useEffect } from 'react';
import './App.css';
import { chatWithMinimax, ChatMessage } from './services/minimax';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      name: 'system',
      content: 'You are a history expert. You use web search to provide detailed, accurate, and interesting answers to history-related questions. When appropriate, provide context and cite your sources or mention that you looked it up online.'
    },
    {
      role: 'assistant',
      name: 'assistant',
      content: 'Hello! I am your AI History Assistant. Ask me any history-related question, and I will search the web to give you the most accurate answer.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_MINIMAX_API_KEY || '');
  const [groupId, setGroupId] = useState(import.meta.env.VITE_MINIMAX_GROUP_ID || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      alert('Please enter your Minimax API Key in the settings or .env file.');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', name: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Exclude the first message if you only want to show user/assistant in UI, 
      // but we need to pass all messages to the API.
      const reply = await chatWithMinimax(newMessages, apiKey, groupId);
      setMessages([...newMessages, { role: 'assistant', name: 'assistant', content: reply }]);
    } catch (error: any) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', name: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🏛️ AI History Explorer</h1>
        <div className="api-key-input" style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Group ID (Optional)" 
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            style={{ width: '150px' }}
          />
          <input 
            type="text" 
            placeholder="Minimax API Key" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </header>

      <main className="chat-container">
        <div className="messages-list">
          {messages.filter(m => m.role !== 'system').map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.role}`}>
              <div className="message-sender">
                {msg.role === 'user' ? 'You' : 'AI History Expert'}
              </div>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-bubble assistant">
              <div className="message-sender">AI History Expert</div>
              <div className="message-content loading">
                Searching the web & thinking<span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a history question (e.g. Who built the pyramids?)"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
