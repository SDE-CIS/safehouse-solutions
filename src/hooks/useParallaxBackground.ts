import { useState, useEffect, useCallback } from "react"

interface ParallaxOptions {
    strength?: number
    transitionSpeed?: number
}

export function useParallaxBackground({
    strength = 10,
    transitionSpeed = 0.2,
}: ParallaxOptions = {}) {
    const [bgPosition, setBgPosition] = useState("50% 50%")

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window
            const x = (e.clientX / innerWidth) * 100
            const y = (e.clientY / innerHeight) * 100

            const offsetX = 50 + (x - 50) / strength
            const offsetY = 50 + (y - 50) / strength

            setBgPosition(`${offsetX}% ${offsetY}%`)
        },
        [strength]
    )

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [handleMouseMove])

    return {
        bgPosition,
        transition: `background-position ${transitionSpeed}s ease-out`,
    }
}
