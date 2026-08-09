'use client';

import React, { useState, useEffect } from 'react';

export interface DocumentItem {
  id: string;
  label: string;
  note?: string;
}

interface DocumentChecklistProps {
  serviceSlug: string;
  documents: DocumentItem[];
}

export function DocumentChecklist({ serviceSlug, documents }: DocumentChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(`checklist_${serviceSlug}`);
      if (stored) {
        setCheckedItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load checklist state from localStorage');
    }
  }, [serviceSlug]);

  const handleCheck = (id: string) => {
    const newState = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newState);
    try {
      localStorage.setItem(`checklist_${serviceSlug}`, JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to save checklist state to localStorage');
    }
  };

  const handleDownload = () => {
    const content = documents.map(doc => {
      const status = checkedItems[doc.id] ? '[x]' : '[ ]';
      const note = doc.note ? `\n    Note: ${doc.note}` : '';
      return `${status} ${doc.label}${note}`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serviceSlug}-required-documents.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const collectedCount = documents.filter(doc => checkedItems[doc.id]).length;

  if (!documents || documents.length === 0) return null;

  return (
    <div className="bg-white border border-rule rounded-sm p-6 my-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-rule pb-4">
        <div>
          <h3 className="font-display text-2xl text-ink">Required Documents</h3>
          <p className="font-label text-sm text-ink-soft mt-1" aria-live="polite">
            {isClient ? `${collectedCount} of ${documents.length} collected` : `${documents.length} items required`}
          </p>
        </div>
        {isClient && (
          <button 
            onClick={handleDownload}
            className="text-sm font-label text-seal hover:bg-seal hover:text-white transition-colors flex items-center gap-2 border border-seal px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-seal"
            aria-label="Download this checklist as a text file"
          >
            Download Checklist
          </button>
        )}
      </div>

      <ul className="space-y-5">
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-start gap-4">
            <div className="pt-1 flex-shrink-0">
              <input
                type="checkbox"
                id={`check-${serviceSlug}-${doc.id}`}
                checked={!!checkedItems[doc.id]}
                onChange={() => handleCheck(doc.id)}
                className="w-5 h-5 border-rule rounded-sm text-seal focus:ring-seal cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label 
                htmlFor={`check-${serviceSlug}-${doc.id}`}
                className={`font-body text-lg select-none cursor-pointer block ${checkedItems[doc.id] ? 'text-ink-soft line-through' : 'text-ink'}`}
              >
                {doc.label}
              </label>
              {doc.note && (
                <details className="mt-2 text-sm group">
                  <summary className="font-label text-ink-soft cursor-pointer hover:text-ink transition-colors focus:outline-none focus:text-seal">
                    View edge case note
                  </summary>
                  <p className="font-body text-ink-soft mt-2 pl-4 border-l-2 border-rule bg-paper-deep p-3 rounded-sm leading-relaxed">
                    {doc.note}
                  </p>
                </details>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
