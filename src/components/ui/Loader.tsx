'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  show: boolean
}

export const Loader: React.FC<LoaderProps> = ({ show }) => {
  return (
    <div
      className={cn(
        'fixed transition-opacity duration-300 ease-out z-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-16 py-8 rounded-md bg-background/90 flex justify-center items-center backdrop-blur-xs border',
        show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      role="status"
      aria-live="polite"
      aria-busy={show}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="animate-spin duration-1500"
          role="img"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
        </svg>
        <span className="text-md font-semi-bold">Loading...</span>
      </div>
    </div>
  )
}
