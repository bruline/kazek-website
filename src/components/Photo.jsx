import { useState } from 'react'

// A photo that falls back to a Kazek campus photo if the file is missing.
// showCredit adds a small "Photo: name / Unsplash" line; place the Photo in a
// "relative" box and position the line with creditClass.
export default function Photo({ photo, alt = '', className = '', showCredit = false, creditClass = 'absolute bottom-2 right-3', eager = false }) {
  const [src, setSrc] = useState(photo.src)
  const usingFallback = src !== photo.src
  return (
    <>
      <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'}
        onError={() => photo.fallback && !usingFallback && setSrc(photo.fallback)} />
      {showCredit && photo.credit && !usingFallback && photo.credit !== 'Kazek University' && (
        <span className={`text-[11px] text-white/85 bg-black/30 rounded px-1.5 py-0.5 ${creditClass}`}>Photo: {photo.credit}</span>
      )}
    </>
  )
}
