import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Location } from 'history'

import { isInstanceOfModalRouteLocationState } from '../../../common/guards/routing.guards'
import { TBurgerIngredientType } from '../../../common/models/fetch-process.model'
import { IModalRouteLocationState } from '../../../common/models/routing.model'

/**
 * Check if passing history location is pointing to modal window
 *
 * @param location Passing location (roo history location)
 * @returns Result if the passing location is a "modal" location
 */
export const isModalRouteLocation = (
  location: IModalRouteLocationState | Location<unknown>,
): boolean => {
  if (isInstanceOfModalRouteLocationState(location)) {
    return location.isModal
  }

  return false
}

// NOTE: Based on this article (with improvements) => https://www.smashingmagazine.com/2021/07/dynamic-header-intersection-observer/

export const useDynamicTabsWithIntersection = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  defaultTabSection: TBurgerIngredientType,
): [
  currentTabSection: string,
  setCurrentTabSection: Dispatch<SetStateAction<string>>,
  observerRef: MutableRefObject<IntersectionObserver | null>,
] => {
  // ESLint + https://www.emgoto.com/storing-values-with-useref/ hint to use useRef, due to re-initialize each time during re-render
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Couldn't use my own type "TBurgerIngredientType" because library component is waiting "string"
  const [currentTabSection, setCurrentTabSection] = useState<string>(defaultTabSection)

  useEffect(() => {
    if (ref.current) {
      const header = ref.current.querySelector('[data-header]') as HTMLElement

      // With latest versions of Chrome starts working with NodeList as Array, but For TypeScript you need to cast it or
      // use Array.from or call() with Array prototype, etc.
      const sections = [
        ...Array.from(ref.current.querySelectorAll('[data-section]')),
      ] as HTMLElement[]

      const scrollRoot = ref.current.querySelector('[data-scroller]') as HTMLElement

      // Direction of scroll (default up)
      let direction = 'up'
      let prevYPosition = 0

      // IntersectionObserver config
      const options = {
        root: scrollRoot,
        rootMargin: `${header.offsetHeight * -1}px`,
        threshold: 0.1,
        // Intersection Observer v2 API
        trackVisibility: true,
        delay: 100,
      }

      const setScrollDirection = () => {
        if (scrollRoot.scrollTop > prevYPosition) {
          direction = 'down'
        } else {
          direction = 'up'
        }

        prevYPosition = scrollRoot.scrollTop
      }

      const updateTabSectionValue = (target: Element) => {
        const tabSectionValue = (target as HTMLElement).dataset.section as TBurgerIngredientType
        setCurrentTabSection(tabSectionValue)
      }

      const getCurrentVisibleSection = (target: Element) => {
        if (direction === 'up') {
          return target
        }

        if (target.nextElementSibling) {
          return target.nextElementSibling
        }

        return target
      }

      const isIntersectingUpdatable = (entry: IntersectionObserverEntry) => {
        if (direction === 'down' && !entry.isIntersecting) {
          return true
        }

        /* if (direction === 'up' && entry.isIntersecting) {
          return true
        }

        return false */

        return direction === 'up' && entry.isIntersecting
      }

      const onIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry, i: number) => {
          setScrollDirection()

          /**
           * It's kind of hack/check :) if there is multiple items at the same time are visible,
           * because IntersectionObserver will trigger twice due to "Bun" and "Sauce" sections are
           * visible and "isIntersecting" and the current state will be set to "Sauce" (or others/whatever).
           *
           * Anyway there are couple of "hacks" (at least what I've tested and found by myself)
           * how to fix this (because after IntersectionObserver initialized => it will trigger only for one element):
           * - check if multiple items are "isIntersecting" => skip update
           * - check "intersectionRatio" value to be more than "0.5" (most of the part is visible) => skip update
           * - update "threshold" (~0.3) prop for IntersectionObserver config to be greater than 0, so it will check more ratio
           * - use "getBoundingClientRect", but it listen "scroll" event is more "heavier" than IntersectionObserver
           */
          if (i > 0 && entry.isIntersecting && entries[i - 1].isIntersecting) {
            return
          }

          /* Do nothing if no need to update */
          if (!isIntersectingUpdatable(entry)) {
            return
          }

          const target = getCurrentVisibleSection(entry.target)

          updateTabSectionValue(target)
        })
      }

      /* Create the observer */
      const observer = new IntersectionObserver(onIntersect, options)
      observerRef.current = observer

      /* Set our observer to observe each section */
      sections.forEach((section) => {
        observer.observe(section)
      })
    }

    return () => {
      observerRef?.current?.disconnect()
    }
  }, [ref])

  return [currentTabSection, setCurrentTabSection, observerRef]
}
