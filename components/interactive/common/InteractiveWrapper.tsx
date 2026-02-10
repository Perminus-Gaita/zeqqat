"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface InteractiveWrapperProps {
  children: ReactNode;
  fallbackImage?: string;
  fallbackAlt: string;
  caption?: string;
}

/**
 * Wraps interactive components with a static image fallback.
 * - Google/crawlers see the <noscript> image + alt text
 * - Users get the full interactive component
 */
export default function InteractiveWrapper({
  children,
  fallbackImage,
  fallbackAlt,
  caption,
}: InteractiveWrapperProps) {
  return (
    <figure className="my-8 not-prose">
      {/* Interactive version for users */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {children}
      </div>

      {/* Static fallback for crawlers / no-JS */}
      {fallbackImage && (
        <noscript>
          <Image
            src={fallbackImage}
            alt={fallbackAlt}
            width={800}
            height={450}
            className="rounded-lg w-full"
          />
        </noscript>
      )}

      {caption && (
        <figcaption className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
