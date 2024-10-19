import { useState, useEffect, useRef } from 'react';
import { chatService } from '../src/services/chat.service';

export const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [fullInput, setFullInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleUserMessage = (userInput) => {
    const userMessage = { parts: [{ text: userInput }], role: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setFullInput(userInput);
    setInput('');
    setIsLoading(true);
  };

  useEffect(() => {
    if (fullInput) handleBotResponse(fullInput);
  }, [fullInput]);


  const handleBotResponse = async (userInput) => {
    try {
      const botResponse = await chatService.processChatStream(userInput, messages);
      setMessages(prevMessages => [...prevMessages, { parts: [{ text: botResponse }], role: 'model' }]);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    if (userInput) handleUserMessage(userInput);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        <div className="message model">Hola, ¿cómo puedo ayudarte?</div>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.parts.map((part, partIndex) => <span key={partIndex}>{part.text}</span>)}
          </div>
        ))}
        {isLoading && <div className="message model">...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-submit">Send</button>
      </form>
    </div>
  );
}

