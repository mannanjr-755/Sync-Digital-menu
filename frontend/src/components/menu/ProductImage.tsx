"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop";

export function ProductImage({
  src,
  alt,
  className = "",
  sizes = "160px",
  priority,
  fill,
  width = 160,
  height = 160,
}: Props) {
  const [error, setError] = useState(false);
  const imageSrc = error ? FALLBACK : src;

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
}
