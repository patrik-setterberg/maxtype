'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, RotateCcw, Globe, Keyboard, Clock, Eye, FileText } from 'lucide-react'

import { PreferenceSchema, type UserPreferences } from '@/lib/validation'
import { sanitizeCustomText, validateCustomText } from '@/lib/utils'
import { Button } from './Button'
import { Switch } from './switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Textarea } from './textarea'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
] as const

const KEYBOARD_LAYOUT_OPTIONS = [
  { value: 'qwerty_us', label: 'QWERTY (US)', description: 'Standard US English layout' },
  { value: 'qwerty_sv', label: 'QWERTY (Swedish)', description: 'Swedish QWERTY layout' },
  { value: 'azerty_fr', label: 'AZERTY (French)', description: 'French AZERTY layout' },
  { value: 'qwertz_de', label: 'QWERTZ (German)', description: 'German QWERTZ layout' },
  { value: 'qwerty_es', label: 'QWERTY (Spanish)', description: 'Spanish QWERTY layout' },
  { value: 'qwerty_pt', label: 'QWERTY (Portuguese)', description: 'Portuguese QWERTY layout' },
  { value: 'dvorak_us', label: 'DVORAK (US)', description: 'Alternative US layout' },
  { value: 'colemak', label: 'COLEMAK', description: 'Modern alternative layout' },
] as const

const TEST_DURATION_OPTIONS = [
  { value: '30', label: '30 seconds', description: 'Quick test' },
  { value: '60', label: '60 seconds', description: 'Standard test' },
  { value: '120', label: '120 seconds', description: 'Extended test' },
] as const

const TEXT_TYPE_OPTIONS = [
  { value: 'words', label: 'Random Words', description: 'Individual words for focused practice' },
  {
    value: 'sentences',
    label: 'Random Sentences',
    description: 'Complete sentences with natural flow',
  },
  {
    value: 'paragraphs',
    label: 'Full Paragraphs',
    description: 'Literary excerpts and longer texts',
  },
  {
    value: 'punctuation',
    label: 'Punctuation Practice',
    description: 'Technical text with symbols and formatting',
  },
  { value: 'custom', label: 'Custom Text', description: 'Import your own text for practice' },
] as const

interface PreferenceFormFieldsProps {
  preferences: UserPreferences
  onSubmit: (data: UserPreferences) => Promise<void>
  onReset: () => Promise<void>
  isLoading: boolean
}

export function PreferenceFormFields({
  preferences,
  onSubmit,
  onReset,
  isLoading,
}: PreferenceFormFieldsProps) {
  const [customText, setCustomText] = useState('')
  const [customTextError, setCustomTextError] = useState<string>('')

  const form = useForm<UserPreferences>({
    resolver: zodResolver(PreferenceSchema),
    defaultValues: preferences,
  })

  // Reset form values when preferences change (e.g., after loading from API)
  useEffect(() => {
    form.reset(preferences)
  }, [preferences, form])

  const handleCustomTextChange = (value: string) => {
    // Sanitize the input immediately
    const sanitized = sanitizeCustomText(value)
    setCustomText(sanitized)

    // Validate the sanitized text
    const validation = validateCustomText(sanitized)
    setCustomTextError(validation.isValid ? '' : validation.error || '')
  }

  const handleSubmit = async (data: UserPreferences) => {
    // If custom text type is selected, validate the custom text before submission
    if (data.textType === 'custom') {
      const validation = validateCustomText(customText)
      if (!validation.isValid) {
        setCustomTextError(validation.error || 'Custom text is invalid')
        return // Don't submit if custom text is invalid
      }
    }

    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Language Selection */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="rounded-lg border p-4">
              <FormLabel className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" />
                Language
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.flag}</span>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose your preferred language for the typing test interface.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Test Duration Selection */}
        <FormField
          control={form.control}
          name="testDuration"
          render={({ field }) => (
            <FormItem className="rounded-lg border p-4">
              <FormLabel className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Test Duration
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TEST_DURATION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Choose how long each typing test should last.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Text Type Selection */}
        <FormField
          control={form.control}
          name="textType"
          render={({ field }) => (
            <div className="rounded-lg border p-4 space-y-4">
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Text Type
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select text type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TEXT_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the type of text content for your typing tests.
                </FormDescription>
                <FormMessage />
              </FormItem>

              {/* Custom Text Area - only shown when custom text type is selected */}
              {field.value === 'custom' && (
                <div className="pt-4 border-t border-border/50">
                  <FormLabel className="text-sm font-medium">Custom Text</FormLabel>
                  <Textarea
                    placeholder="Paste your custom text here for typing practice..."
                    value={customText}
                    onChange={e => handleCustomTextChange(e.target.value)}
                    className={`mt-2 min-h-[120px] ${
                      customTextError ? 'border-destructive focus-visible:ring-destructive/20' : ''
                    }`}
                    disabled={isLoading}
                    aria-invalid={!!customTextError}
                  />
                  {customTextError && (
                    <p className="text-sm text-destructive mt-2">{customTextError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter or paste any text you want to practice typing. HTML tags and scripts will
                    be automatically removed for security. Maximum 10,000 characters.
                  </p>
                </div>
              )}
            </div>
          )}
        />

        {/* Show Keyboard Toggle with Keyboard Layout */}
        <FormField
          control={form.control}
          name="showKeyboard"
          render={({ field }) => (
            <div className="rounded-lg border p-4 space-y-4">
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Eye className="h-4 w-4" />
                    Show Virtual Keyboard
                  </FormLabel>
                  <FormDescription>
                    Display a visual keyboard during typing tests to help with key positioning.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>

              {/* Keyboard Layout Selection - only shown when virtual keyboard is enabled */}
              {field.value && (
                <FormField
                  control={form.control}
                  name="keyboardLayout"
                  render={({ field: layoutField }) => (
                    <FormItem className="pt-4 border-t border-border/50">
                      <FormLabel className="flex items-center gap-2">
                        <Keyboard className="h-4 w-4" />
                        Keyboard Layout
                      </FormLabel>
                      <Select onValueChange={layoutField.onChange} value={layoutField.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a keyboard layout" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {KEYBOARD_LAYOUT_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the keyboard layout that matches your physical keyboard.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Preferences
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Reset to Defaults
          </Button>
        </div>

        {/* Form Status */}
        {form.formState.isDirty && !isLoading && (
          <p className="text-sm text-muted-foreground">You have unsaved changes.</p>
        )}
      </form>
    </Form>
  )
}
