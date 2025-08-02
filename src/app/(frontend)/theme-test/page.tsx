'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { MessageAlert } from '@/components/ui/MessageAlert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ThemeTestPage() {
  return (
    <div className={cn('min-h-screen p-8 space-y-8')}>
      <div className={cn('max-w-4xl mx-auto space-y-12')}>
        {/* Header */}
        <div className={cn('text-center space-y-4')}>
          <h1 className={cn('text-4xl font-bold')}>MaxType Theme Showcase</h1>
          <p className={cn('text-lg text-muted-foreground')}>
            Warm Creamy Light & Balanced Dark with Elegant Accents
          </p>
        </div>

        {/* Message Alerts */}
        <div className={cn('space-y-6')}>
          <h2 className={cn('text-2xl font-semibold')}>Message Alerts</h2>
          <div className={cn('grid gap-4')}>
            <MessageAlert
              message="Your account has been successfully created! Please check your email to verify your account."
              type="success"
            />
            <MessageAlert
              message="Your typing speed has improved! You're now averaging 45 WPM."
              type="info"
              title="Progress Update"
            />
            <MessageAlert
              message="Please save your work before the session expires in 5 minutes."
              type="warning"
            />
            <MessageAlert
              message="Invalid username or password. Please check your credentials and try again."
              type="error"
            />
          </div>
        </div>

        {/* Form Elements */}
        <div className={cn('space-y-6')}>
          <h2 className={cn('text-2xl font-semibold')}>Form Elements</h2>
          <div className={cn('bg-card p-6 rounded-lg border space-y-4')}>
            <div className={cn('grid gap-2')}>
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" />
            </div>

            <div className={cn('grid gap-2')}>
              <Label htmlFor="language">Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={cn('flex items-center space-x-2')}>
              <Switch id="show-keyboard" />
              <Label htmlFor="show-keyboard">Show virtual keyboard</Label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className={cn('space-y-6')}>
          <h2 className={cn('text-2xl font-semibold')}>Buttons & Actions</h2>
          <div className={cn('flex flex-wrap gap-4')}>
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>

        {/* Cards & Layouts */}
        <div className={cn('space-y-6')}>
          <h2 className={cn('text-2xl font-semibold')}>Cards & Layout</h2>
          <div className={cn('grid md:grid-cols-2 gap-6')}>
            <div className={cn('bg-card p-6 rounded-lg border')}>
              <h3 className={cn('text-lg font-semibold mb-2')}>Typing Statistics</h3>
              <p className={cn('text-muted-foreground mb-4')}>Your recent performance metrics</p>
              <div className={cn('space-y-2')}>
                <div className={cn('flex justify-between')}>
                  <span>Words per minute:</span>
                  <span className={cn('font-medium text-primary')}>42 WPM</span>
                </div>
                <div className={cn('flex justify-between')}>
                  <span>Accuracy:</span>
                  <span className={cn('font-medium text-success')}>94%</span>
                </div>
                <div className={cn('flex justify-between')}>
                  <span>Tests completed:</span>
                  <span className={cn('font-medium')}>127</span>
                </div>
              </div>
            </div>

            <div className={cn('bg-card p-6 rounded-lg border')}>
              <h3 className={cn('text-lg font-semibold mb-2')}>User Preferences</h3>
              <p className={cn('text-muted-foreground mb-4')}>Customize your typing experience</p>
              <div className={cn('space-y-3')}>
                <div className={cn('flex justify-between items-center')}>
                  <span>Language:</span>
                  <span className={cn('text-sm bg-secondary px-2 py-1 rounded')}>English</span>
                </div>
                <div className={cn('flex justify-between items-center')}>
                  <span>Keyboard Layout:</span>
                  <span className={cn('text-sm bg-secondary px-2 py-1 rounded')}>QWERTY</span>
                </div>
                <div className={cn('flex justify-between items-center')}>
                  <span>Test Duration:</span>
                  <span className={cn('text-sm bg-secondary px-2 py-1 rounded')}>60 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Display */}
        <div className={cn('space-y-6')}>
          <h2 className={cn('text-2xl font-semibold')}>Color Palette</h2>
          <div className={cn('grid grid-cols-2 md:grid-cols-5 gap-4')}>
            <div className={cn('bg-primary p-4 rounded-lg text-primary-foreground text-center')}>
              <div className={cn('font-medium')}>Primary</div>
              <div className={cn('text-sm opacity-80')}>Elegant Slate</div>
            </div>
            <div className={cn('bg-success p-4 rounded-lg text-success-foreground text-center')}>
              <div className={cn('font-medium')}>Success</div>
              <div className={cn('text-sm opacity-80')}>Elegant Green</div>
            </div>
            <div className={cn('bg-info p-4 rounded-lg text-info-foreground text-center')}>
              <div className={cn('font-medium')}>Info</div>
              <div className={cn('text-sm opacity-80')}>Refined Slate</div>
            </div>
            <div className={cn('bg-warning p-4 rounded-lg text-warning-foreground text-center')}>
              <div className={cn('font-medium')}>Warning</div>
              <div className={cn('text-sm opacity-80')}>Refined Gold</div>
            </div>
            <div
              className={cn(
                'bg-destructive p-4 rounded-lg text-destructive-foreground text-center',
              )}
            >
              <div className={cn('font-medium')}>Error</div>
              <div className={cn('text-sm opacity-80')}>Elegant Coral</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
