import React from 'react'
import { cn } from '@/lib/utils'

export default function PrivacyPage() {
  return (
    <div className={cn('container mx-auto px-4 py-8')}>
      <div className={cn('max-w-3xl mx-auto')}>
        {/* Header */}
        <div className={cn('text-center mb-12')}>
          <h1 className={cn('text-4xl font-bold mb-4')}>Privacy Policy</h1>
          <p className={cn('text-muted-foreground')}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className={cn('space-y-8')}>
          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Information We Collect</h2>
            <div className={cn('space-y-4 text-muted-foreground leading-relaxed')}>
              <p>
                When you create an account with MaxType, we collect basic information including:
              </p>
              <ul className={cn('ml-6 space-y-1')}>
                <li>• Username and email address</li>
                <li>• Your typing test preferences (language, keyboard layout, test duration)</li>
                <li>• Typing test results and statistics (when logged in)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>How We Use Your Information</h2>
            <div className={cn('space-y-4 text-muted-foreground leading-relaxed')}>
              <p>We use the information we collect to:</p>
              <ul className={cn('ml-6 space-y-1')}>
                <li>• Provide and maintain our typing test service</li>
                <li>• Save your preferences and settings</li>
                <li>• Track your typing progress and statistics</li>
                <li>• Communicate with you about your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Data Storage and Security</h2>
            <p className={cn('text-muted-foreground leading-relaxed')}>
              Your data is stored securely and we implement appropriate security measures to 
              protect your personal information. We do not sell, trade, or share your personal 
              information with third parties.
            </p>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Guest Users</h2>
            <p className={cn('text-muted-foreground leading-relaxed')}>
              If you use MaxType without creating an account, we do not collect or store any 
              personal information. Your settings and preferences may be stored locally in 
              your browser but are not transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Your Rights</h2>
            <div className={cn('space-y-4 text-muted-foreground leading-relaxed')}>
              <p>You have the right to:</p>
              <ul className={cn('ml-6 space-y-1')}>
                <li>• Access and update your personal information</li>
                <li>• Delete your account and associated data</li>
                <li>• Export your typing statistics and data</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className={cn('text-2xl font-semibold mb-4')}>Contact Us</h2>
            <p className={cn('text-muted-foreground leading-relaxed')}>
              If you have any questions about this Privacy Policy or how we handle your data, 
              please contact us at privacy@maxtype.app.
            </p>
          </section>

          <section className={cn('bg-muted/30 p-6 rounded-lg')}>
            <h2 className={cn('text-xl font-semibold mb-3')}>Simple Promise</h2>
            <p className={cn('text-muted-foreground leading-relaxed')}>
              We believe in keeping things simple: we only collect what we need to make MaxType 
              work well for you, we keep it secure, and we never share it with anyone else.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}