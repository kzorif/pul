"use client"

import { useEffect } from "react"

function hydrateUrduAttributes(root: ParentNode = document) {
  root.querySelectorAll?.(".urdu").forEach((element) => {
    element.setAttribute("dir", "rtl")
    element.setAttribute("lang", "ur")
  })
}

export function UrduAttributeHydrator() {
  useEffect(() => {
    hydrateUrduAttributes()
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains("urdu")) {
              node.setAttribute("dir", "rtl")
              node.setAttribute("lang", "ur")
            }
            hydrateUrduAttributes(node)
          }
        })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
