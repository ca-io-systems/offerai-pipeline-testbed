'use client'

import { useState, useCallback } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [url])

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch {
        // User cancelled or error
      }
    }
  }, [url, title, description])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`

  const supportsNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Share:</span>
      
      {supportsNativeShare && (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          aria-label="Share using native share"
        >
          Share
        </button>
      )}

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center justify-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        aria-label="Copy link to clipboard"
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-[#1877F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#166FE5] transition-colors"
        aria-label="Share on Facebook"
      >
        Facebook
      </a>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A91DA] transition-colors"
        aria-label="Share on Twitter"
      >
        Twitter
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#22C55E] transition-colors"
        aria-label="Share on WhatsApp"
      >
        WhatsApp
      </a>

      <a
        href={emailUrl}
        className="inline-flex items-center justify-center rounded-full bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        aria-label="Share via Email"
      >
        Email
      </a>
    </div>
  )
}
