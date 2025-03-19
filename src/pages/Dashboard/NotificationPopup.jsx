// NotificationPopup.jsx
import React, { useState, useEffect } from 'react';

const NotificationPopup = ({ templateId, templateName, authToken, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Function to copy code block to clipboard and close the popup
  const copyCodeToClipboard = () => {
    const codeText = `const char* authToken  = "${authToken}";\nconst char* templateID = "${templateId}";`;
    
    navigator.clipboard.writeText(codeText)
      .then(() => {
        setCopySuccess(true);
        
        // Close the popup after showing success message for 2 seconds
        setTimeout(() => {
          setCopySuccess(false);
          onClose();
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 rounded-lg shadow-lg w-96 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white">New Template Created!</h3>
    
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <span className="text-xl">×</span>
        </button>
      </div>
      
      <div className="p-4">
        <div className="bg-gray-900 rounded p-3 mb-4 font-mono text-sm text-green-400 overflow-x-auto relative group">
          <div>{`const char* authToken  = "${authToken}";`}</div>
          <div>{`const char* templateID = "${templateId}";`}</div>
          
          {/* Copy button for the code block */}
          <button 
            onClick={copyCodeToClipboard}
            className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy code"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </button>
          
          {/* Success indicator */}
          {/* {copySuccess && (
            <div className="absolute top-2 right-10 bg-green-600 text-white px-2 py-1 rounded text-xs animate-fade-in-out">
              Copied!
            </div>
          )} */}
        </div>
        
        <p className="text-gray-300 text-sm mb-4">
          Template ID, Template Name, and AuthToken should be declared at the very top of the firmware code.
        </p>
        
        <div className="flex justify-end space-x-2">
          <button 
            className={`px-4 py-2 rounded flex items-center ${
              copySuccess 
                ? "bg-green-600 text-white" 
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={copyCodeToClipboard}
            disabled={copySuccess}
          >
            {copySuccess ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Copy to clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add animation styles for the copy success indicator
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
  .animate-fade-in-out {
    animation: fadeInOut 2s ease-in-out;
  }
`;
document.head.appendChild(style);

export default NotificationPopup;