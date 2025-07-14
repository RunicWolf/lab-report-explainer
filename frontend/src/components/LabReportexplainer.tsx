import React, { useState } from 'react';
import axios from 'axios';

type ExplanationData = {
  diagnosis: string;
  suggested_action: string;
  notes: string;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const LabReportExplainer: React.FC = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatMode, setChatMode] = useState<'structured' | 'chat'>('structured');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setExplanation(null);
    setChatHistory([]);
    setSessionId(null);
    setError('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text);

    try {
      const response = await axios.post('http://localhost:8000/start-session/', formData);

      if (response.data.session_id && response.data.diagnosis) {
        setSessionId(response.data.session_id);
        setExplanation({
          diagnosis: response.data.diagnosis,
          suggested_action: response.data.suggested_action,
          notes: response.data.notes,
        });

        setChatHistory([
          {
            role: 'assistant',
            content: JSON.stringify({
              diagnosis: response.data.diagnosis,
              suggested_action: response.data.suggested_action,
              notes: response.data.notes,
            }, null, 2),
          },
        ]);

        setChatMode('structured');
      } else {
        setError(response.data.error || 'Unexpected response format.');
      }
    } catch (err: any) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !sessionId) return;

    const newMessage: Message = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, newMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat/', {
        session_id: sessionId,
        user_message: chatInput,
      });

      setChatMode('chat'); // Switch mode after first chat message

      const assistantReply = response.data.response || 'No response.';

      const replyMessage: Message = {
        role: 'assistant',
        content: assistantReply,
      };

      setChatHistory(prev => [...prev, replyMessage]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lab Report Explainer</h1>


      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste lab report text..."
          className="w-full p-2 border rounded"
          rows={6}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"

        >
          {loading ? 'Processing...' : 'Generate Explanation'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {explanation && (
        <div className="mt-6 space-y-4 bg-gray-100 p-4 rounded">
          <div>
            <h2 className="font-semibold">Diagnosis:</h2>
            <p>{explanation.diagnosis}</p>
          </div>
          <div>
            <h2 className="font-semibold">Suggested Action:</h2>
            <p>{explanation.suggested_action}</p>
          </div>
          <div>
            <h2 className="font-semibold">Notes:</h2>
            <p>{explanation.notes}</p>
          </div>
        </div>
      )}

      {sessionId && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Chat with Assistant</h2>
          <div className="bg-white border rounded p-4 mb-4 max-h-96 overflow-y-auto">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <strong className={msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}>
                  {msg.role === 'user' ? 'You' : 'Assistant'}:
                </strong>
                {chatMode === 'structured' && msg.role === 'assistant' ? (
                  <pre className="whitespace-pre-wrap">{msg.content}</pre>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Ask a follow-up question..."
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"

            >
              {chatLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LabReportExplainer;
