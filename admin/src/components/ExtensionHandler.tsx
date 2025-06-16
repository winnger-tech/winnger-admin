'use client'

import { useEffect } from 'react'

export default function ExtensionHandler() {
  useEffect(() => {
    // Remove Grammarly attributes if they exist
    document.body.removeAttribute('data-new-gr-c-s-check-loaded')
    document.body.removeAttribute('data-gr-ext-installed')
  }, [])

  return null
} 