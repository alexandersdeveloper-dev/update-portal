import { useEffect } from 'react'

export function useScrollReveal(ready = true, selector = '[data-reveal]') {
  useEffect(() => {
    if (!ready) return

    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay ?? 0
            setTimeout(() => {
              entry.target.classList.add('reveal--visible')
            }, Number(delay))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [ready, selector])
}
