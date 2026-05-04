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
        : variant === 'about'
          ? 'w-full max-w-[min(100%,18rem)] sm:max-w-[min(100%,22rem)] md:max-w-[min(100%,26rem)] lg:max-w-[min(100%,28rem)] h-auto max-h-[min(26vh,10.5rem)] sm:max-h-[min(28vh,12rem)] md:max-h-[13.5rem] lg:max-h-[15rem] mx-auto'
          : variant === 'compact'
            ? 'h-10 sm:h-11 w-auto max-h-12'
            : 'h-[2.875rem] min-h-[2.875rem] sm:h-[3.25rem] sm:min-h-[3.25rem] md:h-14 md:min-h-14 w-auto max-h-14';

  const intrinsic =
    variant === 'about' ? { width: 400, height: 160 } : { width: 240, height: 96 };

  const objectAlign = variant === 'footer' ? 'object-left' : 'object-center';

  return (
    <img
      src="/hermes-logo.png"
      alt="Hermes AI logo"
      width={intrinsic.width}
      height={intrinsic.height}
      decoding="async"
      fetchPriority={variant === 'nav' ? 'high' : 'auto'}
      className={`block object-contain ${objectAlign} ${preset} ${className}`}
    />
  );
}
