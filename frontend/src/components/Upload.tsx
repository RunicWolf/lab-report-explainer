import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Text:", text);
    console.log("File:", file);
    // Submit logic will go here
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-xl shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload Your Lab Report</h2>
      <textarea
        className="w-full border p-2 mb-4"
        rows={6}
        placeholder="Paste your report text here..."
        onChange={handleTextChange}
      />
      <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
