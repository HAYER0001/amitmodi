'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4 my-10">
      {items.map((item, index) => (
        <AccordionItem key={index} item={item} />
      ))}
    </div>
  );
}

function AccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-rule rounded-sm overflow-hidden bg-paper">
      <h3>
        <button
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-paper-deep transition-colors focus:outline-none focus:ring-2 focus:ring-seal"
        >
          <span className="font-body font-bold text-xl text-ink pr-4">{item.question}</span>
          <span 
            className={`text-seal text-2xl font-label transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} 
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      
      {/* 
        CRITICAL SEO DECISION: The answer content is visually hidden using CSS grid height 
        and opacity when collapsed, but it remains fully present in the DOM. This ensures 
        search engine crawlers and AI agents index the answers without needing to execute 
        JavaScript or simulate clicks.
      */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 py-5 font-body text-lg text-ink-soft leading-relaxed border-t border-rule bg-white">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
