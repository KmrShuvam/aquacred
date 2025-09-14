// src/app/upload/page.tsx
'use client'; // This tells Next.js to run this code in the browser

import { useState } from 'react';

export default function UploadPage() {
  const = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Submitting to the blockchain... Please wait.');

    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch('/api/submit-project', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        const etherscanLink = `https://sepolia.etherscan.io/tx/${result.transactionHash}`;
        setStatus(`Success! <a href="${etherscanLink}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">View on Etherscan</a>`);
      } else {
        setStatus(`Error: ${result.message}`);
      }
    } catch (error: any) {
      setStatus(`Submission failed: ${error.message}`);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register New Project
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="projectName" className="block text-gray-700 font-semibold mb-2">Project Name</label>
            <input type="text" id="projectName" name="projectName" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Location (State)</label>
            <input type="text" id="location" name="location" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="implementingBody" className="block text-gray-700 font-semibold mb-2">Implementing Body</label>
            <input type="text" id="implementingBody" name="implementingBody" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="areaHectares" className="block text-gray-700 font-semibold mb-2">Area (Hectares)</label>
            <input type="number" id="areaHectares" name="areaHectares" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">Start Date</label>
            <input type="date" id="startDate" name="startDate" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="projectType" className="block text-gray-700 font-semibold mb-2">Project Type</label>
            <input type="text" id="projectType" name="projectType" defaultValue="Mangrove Afforestation" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Submit to Ledger
          </button>
        </form>
        {status && <div className="mt-4 text-center text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: status }} />}
      </div>
    </div>
  );
}