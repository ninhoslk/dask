"use client"

import { useEffect } from "react"

// Reveals every [data-reveal] element once it scrolls into view.
// Content stays visible when this script never runs: the hidden state
// only applies under html.js-motion, which is set here.
export function Motion() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add("js-motion")

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "")
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    )

    const watch = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-shown])")
        .forEach((el) => observer.observe(el))
    watch()

    const mutations = new MutationObserver(watch)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
      root.classList.remove("js-motion")
    }
  }, [])

  return null
}
