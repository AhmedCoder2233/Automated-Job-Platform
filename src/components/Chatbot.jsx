import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';

const InterviewApp = () => {
  const [secretKey, setSecretKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

const handleAuth = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://127.0.0.1:8000/selectedUser');
    const data = await res.json();

    const matched = data.find(user => user.secret_key === secretKey);

    if (matched) {
      setAuthenticated(true);
      setMessages([{ text: 'Welcome! Ask your first question.', sender: 'agent' }]);
      localStorage.setItem('secret_key', matched.secret_key);
      localStorage.setItem('email', matched.email);
    } else {
      alert('Wrong key. Try again.');
    }
  } catch (err) {
    console.error('Auth fetch error:', err);
    alert('Failed to fetch secret keys');
  }
};


  const askBot = async (question) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8080/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: question })
      });
      
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      return data.response || "No response from bot";
    } catch (error) {
      console.error('API call failed:', error);
      return "Sorry, there was an error.";
    } finally {
      setLoading(false);
    }
  };

const saveMessage = async (msg, sender) => {
  try {
    await fetch('http://127.0.0.1:8080/saveChat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage: msg,
        sender: sender,
        timestamp: new Date().toISOString(),
        secret_key: localStorage.getItem("secret_key"),
        email: localStorage.getItem("email"),
      })
    });
  } catch (error) {
    console.error('Failed to save message:', error);
  }
};

const handleMessage = async (e) => {
  e.preventDefault();
  if (!inputMessage.trim() || loading) return;

  const userMessage = { text: inputMessage, sender: 'user' };
  setMessages(m => [...m, userMessage]);
  setInputMessage('');
  saveMessage(userMessage.text, userMessage.sender); 

  const reply = await askBot(inputMessage);
  const botMessage = { text: reply, sender: 'agent' };
  setMessages(m => [...m, botMessage]);
  saveMessage(botMessage.text, botMessage.sender); 
};


  if (!authenticated) {
    return (
      <div className="auth-screen">
        <form onSubmit={handleAuth}>
          <h2>Enter Secret Key</h2>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Try The Key you get in email'"
            autoFocus
          />
          <button type="submit">Start Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <header>
        <h2>Interview Chat</h2>
      </header>

      <div className="chat-window">
        <div className="message-area">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.sender}-msg`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="msg agent-msg">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleMessage} className="input-area">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewApp;