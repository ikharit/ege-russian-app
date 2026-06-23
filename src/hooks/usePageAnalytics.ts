import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAnalyticsStore, EventCategory } from '../stores/analyticsStore'

export function usePageAnalytics(category: EventCategory) {
  const location = useLocation()
  const page = location.pathname
  const startTime = useRef<number>(Date.now())
  const { startPageSession, endPageSession, trackClick } = useAnalyticsStore()

  useEffect(() => {
    startTime.current = Date.now()
    startPageSession(page)

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const element = getElementDescriptor(target)
      if (element) {
        trackClick(element, page, category)
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000)
      endPageSession(page)
      document.removeEventListener('click', handleClick, true)
    }
  }, [page, category, startPageSession, endPageSession, trackClick])
}

function getElementDescriptor(el: HTMLElement): string | null {
  // Try to find a meaningful descriptor
  let current: HTMLElement | null = el
  let depth = 0
  while (current && depth < 5) {
    // Check for data-track attribute
    const trackId = current.getAttribute('data-track')
    if (trackId) return trackId

    // Check for button/anchor with text
    if (current.tagName === 'BUTTON' || current.tagName === 'A') {
      const text = current.textContent?.trim().slice(0, 30)
      if (text) return `${current.tagName.toLowerCase()}:${text}`
    }

    // Check for navigation
    if (current.classList.contains('nav-item') || current.getAttribute('role') === 'button') {
      const text = current.textContent?.trim().slice(0, 30)
      if (text) return `nav:${text}`
    }

    // Check for specific interactive elements
    if (current.tagName === 'INPUT') {
      const type = (current as HTMLInputElement).type
      const placeholder = current.getAttribute('placeholder') || ''
      return `input:${type}${placeholder ? ':' + placeholder : ''}`
    }

    current = current.parentElement
    depth++
  }

  // Fallback: tag name + first few classes
  const classes = el.className.split(' ').filter(c => c && !c.includes(':')).slice(0, 3).join('.')
  return classes ? `${el.tagName.toLowerCase()}.${classes}` : el.tagName.toLowerCase()
}
