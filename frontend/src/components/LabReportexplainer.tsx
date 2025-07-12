import React, { useState } from 'react';
import axios from 'axios';

const LabReportExplainer: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setExplanation('');
    setError('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text);

    try {
      const response = await axios.post('http://localhost:8000/generate-explanation/', formData);
      if (response.data.explanation) {
        setExplanation(response.data.explanation);
      } else {
        setError(response.data.error || 'Unknown error.');
      }
    } catch (err: any) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Processing...' : 'Generate Explanation'}
        </button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {explanation && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Explanation:</h2>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default LabReportExplainer;
