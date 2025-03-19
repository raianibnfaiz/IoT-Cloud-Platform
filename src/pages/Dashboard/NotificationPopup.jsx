// NotificationPopup.jsx
import React, { useState, useEffect } from 'react';

const NotificationPopup = ({ templateId, templateName, authToken, onClose }) => {
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
        <div className="bg-gray-900 rounded p-3 mb-4 font-mono text-sm text-green-400 overflow-x-auto">
          <div>{`const char* authToken  = "${authToken }"`}</div>
          <div>{`const char* templateID = "${templateId}"`}</div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4">
          Template ID, Template Name, and AuthToken should be declared at the very top of the firmware code.
        </p>
        
        <div className="flex justify-end space-x-2">
          <button 
            className="px-4 py-2 bg-gray-700 text-white rounded flex items-center hover:bg-gray-600"
            onClick={() => window.open('/documentation', '_blank')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Documentation
          </button>
          <button 
            className="px-4 py-2 bg-gray-700 text-white rounded flex items-center hover:bg-gray-600"
            onClick={() => {
              navigator.clipboard.writeText(
                `#define BLYNK_TEMPLATE_ID "${templateId}"\n#define BLYNK_TEMPLATE_NAME "${templateName}"\n#define BLYNK_AUTH_TOKEN "${authToken}"`
              );
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
            Copy to clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;