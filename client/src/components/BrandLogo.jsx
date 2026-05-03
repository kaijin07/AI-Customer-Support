import React from 'react';

/**
 * Hermes AI wordmark — transparent PNG at `/hermes-logo.png`.
 * Sizing is height-led so the mark + script stay legible in the nav (target ~40–56px tall).
 */
export default function BrandLogo({ variant = 'nav', className = '' }) {
  const preset =
    variant === 'footer'
      ? 'h-12 sm:h-14 w-auto max-h-[3.75rem]'
      : variant === 'auth'
        ? 'h-32 sm:h-36 w-auto max-h-40'
        : variant === 'compact'
          ? 'h-10 sm:h-11 w-auto max-h-12'
          : 'h-[2.875rem] min-h-[2.875rem] sm:h-[3.25rem] sm:min-h-[3.25rem] md:h-14 md:min-h-14 w-auto max-h-14';

  return (
    <img
      src="/hermes-logo.png"
      alt="Hermes AI logo"
      width={240}
      height={96}
      decoding="async"
      fetchPriority={variant === 'nav' ? 'high' : 'auto'}
      className={`block object-contain object-left ${preset} ${className}`}
    />
  );
}
