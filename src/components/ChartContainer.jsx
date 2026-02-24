import { useState, useEffect, useRef, useCallback } from 'react'

export default function ChartContainer({ height = 288, children }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  const measure = useCallback(() => {
    if (ref.current) {
      const w = ref.current.getBoundingClientRect().width
      if (w > 0) setWidth(Math.floor(w))
    }
  }, [])

  useEffect(() => {
    measure()
    const frame = requestAnimationFrame(measure)

    let observer
    if (ref.current) {
      observer = new ResizeObserver(() => measure())
      observer.observe(ref.current)
    }

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [measure])

  return (
    <div ref={ref} style={{ width: '100%', height, display: 'block' }}>
      {width > 0 && children(width, height)}
    </div>
  )
}
