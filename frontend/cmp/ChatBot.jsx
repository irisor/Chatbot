import { useState, useEffect, useRef } from 'react';
import { chatService } from '../src/services/chat.service';
import { LanguageSelector } from './LanguageSelector';
import { languages, getLanguageByCode } from '../src/config/languages';

// UI translations
const translations = {
  en: {
    greeting: "Hello, how can I help you?",
    placeholder: "Type your message...",
    send: "Send"
  },
  es: {
    greeting: "Hola, ¿cómo puedo ayudarte?",
    placeholder: "Escribe tu mensaje...",
    send: "Enviar"
  },
  fr: {
    greeting: "Bonjour, comment puis-je vous aider?",
    placeholder: "Écrivez votre message...",
    send: "Envoyer"
  },
  de: {
    greeting: "Hallo, wie kann ich Ihnen helfen?",
    placeholder: "Schreiben Sie Ihre Nachricht...",
    send: "Senden"
  }
};

export const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [fullInput, setFullInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(getLanguageByCode('es'));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    setMessages([]);
    setFullInput('');
    setInput('');
    setIsLoading(false);
    
    try {
      await chatService.reset();
    } catch (error) {
      console.error('Error resetting chat service:', error);
    }
  };

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
      const botResponse = await chatService.processChatStream(userInput, messages, language);
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
      <LanguageSelector 
        selectedLanguage={language}
        onLanguageChange={handleLanguageChange}
      />
      <div className="chatbot-messages">
        <div className="message model">{translations[language.code].greeting}</div>
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
          placeholder={translations[language.code].placeholder}
          className="chatbot-input"
          autoFocus
        />
        <button type="submit" className="chatbot-submit">
          {translations[language.code].send}
        </button>
      </form>
    </div>
  );
};
