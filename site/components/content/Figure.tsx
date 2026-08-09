import React from 'react';
import Image from 'next/image';
import { ASSETS } from '@/data/assets';

interface FigureProps {
  assetKey: keyof typeof ASSETS;
  caption?: string;
  priority?: boolean;
}

export function Figure({ assetKey, caption, priority = false }: FigureProps) {
  const asset = ASSETS[assetKey];
  
  if (!asset) {
    return null;
  }

  return (
    <figure className="flex flex-col gap-3 my-8">
      <Image 
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        priority={priority}
        className="rounded-sm bg-white"
      />
      {caption && (
        <figcaption className="text-sm font-label text-ink-soft opacity-80 pl-4 border-l border-rule">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
