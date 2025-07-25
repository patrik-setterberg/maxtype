import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AboutPage() {
  return (
    <div className={cn('container mx-auto px-4 py-8')}>
      <div className={cn('max-w-3xl mx-auto')}>
        {/* Header */}
        <div className={cn('text-center mb-12')}>
          <h1 className={cn('text-4xl font-bold mb-4')}>About MaxType</h1>
          <p className={cn('text-xl text-muted-foreground')}>
            Improve your typing speed and accuracy with our modern typing test platform
          </p>
        </div>

        {/* Content */}
        <div className={cn('space-y-8')}>
          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>What is MaxType?</h2>
            <p className={cn('text-muted-foreground leading-relaxed')}>
              MaxType is a modern typing test application designed to help you improve your typing speed 
              and accuracy. Whether you&apos;re a beginner looking to learn touch typing or an experienced 
              typist aiming to reach new speeds, MaxType provides the tools and practice you need.
            </p>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Features</h2>
            <ul className={cn('space-y-2 text-muted-foreground')}>
              <li>• Multiple test durations (30, 60, 120 seconds)</li>
              <li>• Support for different keyboard layouts (QWERTY, AZERTY, DVORAK)</li>
              <li>• Multiple language options</li>
              <li>• Customizable settings and preferences</li>
              <li>• Progress tracking for registered users</li>
              <li>• Clean, distraction-free interface</li>
            </ul>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Why Choose MaxType?</h2>
            <p className={cn('text-muted-foreground leading-relaxed')}>
              We believe that improving your typing skills should be enjoyable and accessible. 
              MaxType offers a clean, modern interface with customizable settings to match your 
              preferences and learning style. Our platform is designed to be fast, responsive, 
              and user-friendly across all devices.
            </p>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Get Started</h2>
            <p className={cn('text-muted-foreground leading-relaxed mb-4')}>
              Ready to improve your typing? You can start practicing immediately as a guest, 
              or create an account to save your progress and customize your experience.
            </p>
            <div className={cn('flex gap-4')}>
              <Link 
                href="/" 
                className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 transition-colors')}
              >
                Start Typing Test
              </Link>
              <Link 
                href="/signup" 
                className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium border border-primary text-primary hover:bg-primary hover:text-primary-foreground h-10 px-6 py-2 transition-colors')}
              >
                Create Account
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}