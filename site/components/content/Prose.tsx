import React from 'react';

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className = '' }: ProseProps) {
  return (
    <div 
      className={`
        max-w-[68ch] 
        font-body 
        text-ink 
        
        /* Headings */
        [&_h2]:font-display [&_h2]:text-4xl [&_h2]:mt-14 [&_h2]:mb-6
        [&_h3]:font-body [&_h3]:font-bold [&_h3]:text-2xl [&_h3]:mt-10 [&_h3]:mb-4
        
        /* Paragraphs */
        [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-lg
        
        /* Lists */
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:space-y-3 [&_ul]:text-lg
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol]:space-y-3 [&_ol]:text-lg
        
        /* Blockquotes */
        [&_blockquote]:border-l-4 [&_blockquote]:border-rule [&_blockquote]:pl-6 
        [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_blockquote]:my-10 [&_blockquote]:text-xl
        
        /* Links */
        [&_a]:text-seal [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-seal-deep [&_a]:transition-colors
        
        /* Emphasis */
        [&_strong]:font-bold
        
        /* Tables (Responsive horizontal scroll) */
        [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:my-10 
        [&_table]:whitespace-nowrap md:[&_table]:whitespace-normal
        [&_th]:text-left [&_th]:p-4 [&_th]:border-b-2 [&_th]:border-rule [&_th]:font-bold [&_th]:bg-paper-deep [&_th]:text-lg
        [&_td]:p-4 [&_td]:border-b [&_td]:border-rule [&_td]:text-lg
        
        ${className}
      `}
    >
      {children}
    </div>
  );
}
