import Image from "next/image";
import { ASSETS } from "@/data/assets";
import React from 'react';

interface AnswerBlockProps {
  question: string;
  answer: string;
  supportingFacts?: string[];
}

export function AnswerBlock({ question, answer, supportingFacts }: AnswerBlockProps) {
  return (
    <section id="direct-answer" className="relative bg-paper-deep p-8 border-l-4 border-seal my-12 rounded-sm" aria-labelledby="answer-heading">
      {/* A single pen smudge behind the answer — the one block on the page a
          reader stops at. Low opacity so it is texture, never noise. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-6 -top-6 hidden w-24 opacity-[0.18] lg:block">
        <Image
          src={ASSETS["tex-ink-blot"].src}
          alt=""
          width={ASSETS["tex-ink-blot"].width}
          height={ASSETS["tex-ink-blot"].height}
        />
      </div>
      <h2 id="answer-heading" className="font-display text-4xl mb-6 text-ink">
        {question}
      </h2>
      <p className="font-body text-xl leading-relaxed text-ink mb-6">
        {answer}
      </p>
      {supportingFacts && supportingFacts.length > 0 && (
        <ul className="list-disc pl-6 space-y-3 font-body text-ink-soft text-lg">
          {supportingFacts.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
