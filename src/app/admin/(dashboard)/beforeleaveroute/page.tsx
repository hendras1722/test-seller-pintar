'use client'

import RouteLeaveHandler from '@/composable/onBeforeLeave'
import { Suspense } from 'react'

export default function Page() {
  const isDirty = true

  const guardCallback = (to, from, next) => {
    // Your navigation guard logic
    console.log('Navigating from:', from.path)
    console.log('Navigating to:', to) // Now shows correct destination path

    if (isDirty) {
      const userConfirmed = window.confirm(
        `You have unsaved changes. Do you want to navigate to ${to.path}?`
      )
      next(userConfirmed)
    } else {
      next()
    }
    next(true)
  }

  return (
    <Suspense fallback={null}>
      <RouteLeaveHandler guardCallback={guardCallback} />

      <div>leave this page</div>
      {/* Page content */}
    </Suspense>
  )
}
