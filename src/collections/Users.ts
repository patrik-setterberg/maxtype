import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    maxLoginAttempts: 5, // Lock account after 5 failed login attempts
    lockTime: 15 * 60 * 1000, // Unlock after 15 minutes (in milliseconds)
    loginWithUsername: {
      allowEmailLogin: true, // Allow login with both username AND email
      requireEmail: false, // Keep this false to maintain compatibility
    },
    forgotPassword: {
      expiration: 3600000, // 1 hour in milliseconds
      generateEmailHTML: args => {
        const { token } = args || {}
        // Create reset password URL - adjust this to match your frontend URL
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/reset-password?token=${token}`

        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password - MaxType</title>
              <style>
                * { box-sizing: border-box; }
                body { 
                  font-family: system-ui, -apple-system, sans-serif; 
                  line-height: 1.6; 
                  color: #262626; 
                  background: #ffffff;
                  margin: 0;
                  padding: 0;
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background: #ffffff;
                }
                .header { 
                  background: #262626; 
                  color: #ffffff; 
                  padding: 32px 24px; 
                  text-align: center; 
                  border-radius: 10px 10px 0 0; 
                }
                .header h1 { 
                  margin: 0; 
                  font-size: 24px; 
                  font-weight: 600; 
                  letter-spacing: -0.025em;
                }
                .content { 
                  background: #ffffff; 
                  padding: 32px 24px; 
                  border: 1px solid #e5e5e5;
                  border-top: none;
                  border-radius: 0 0 10px 10px; 
                }
                .content h2 { 
                  color: #171717; 
                  font-size: 20px; 
                  font-weight: 600; 
                  margin: 0 0 16px 0; 
                }
                .content p { 
                  color: #525252; 
                  margin: 0 0 16px 0; 
                }
                .button-container { 
                  text-align: center; 
                  margin: 24px 0; 
                }
                .button { 
                  display: inline-block; 
                  background: #262626; 
                  color: #ffffff; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 10px; 
                  font-weight: 500;
                  transition: background-color 0.2s;
                }
                .button:hover { 
                  background: #404040; 
                }
                .code-block { 
                  word-break: break-all; 
                  background: #f5f5f5; 
                  border: 1px solid #e5e5e5;
                  padding: 12px; 
                  border-radius: 6px; 
                  font-family: 'Roboto Mono', monospace; 
                  font-size: 14px;
                  color: #171717;
                  margin: 16px 0;
                }
                .divider {
                  height: 1px;
                  background: #e5e5e5;
                  margin: 24px 0;
                }
                .footer { 
                  color: #737373; 
                  font-size: 14px; 
                }
                .footer p { 
                  color: #737373; 
                }
                .logo {
                  font-family: 'Roboto Mono', monospace;
                  font-weight: 700;
                  letter-spacing: -0.05em;
                }
                
                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                  body { background: #0a0a0a; color: #e5e5e5; }
                  .container { background: #0a0a0a; }
                  .content { 
                    background: #171717; 
                    border-color: #262626; 
                  }
                  .content h2 { color: #ffffff; }
                  .content p { color: #a3a3a3; }
                  .code-block { 
                    background: #262626; 
                    border-color: #404040; 
                    color: #e5e5e5; 
                  }
                  .divider { background: #404040; }
                  .footer p { color: #737373; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 class="logo">MaxType</h1>
                </div>
                <div class="content">
                  <h2>Reset Your Password</h2>
                  <p>We received a request to reset your password for your MaxType account.</p>
                  <p>If you requested this password reset, click the button below to create a new password:</p>
                  
                  <div class="button-container">
                    <a href="${url}" class="button">Reset Password</a>
                  </div>
                  
                  <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                  <div class="code-block">${url}</div>
                  
                  <div class="divider"></div>
                  
                  <div class="footer">
                    <p><strong>Security note:</strong> This password reset link will expire in 1 hour.</p>
                    <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
                    <p>Keep improving your typing skills!<br><strong>The MaxType Team</strong></p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `
      },
      generateEmailSubject: () => {
        return 'Reset your MaxType password'
      },
    },
    verify: {
      generateEmailHTML: args => {
        const { token } = args || {}
        // Create verification URL - adjust this to match your frontend URL
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/verify-email?token=${token}`

        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email - MaxType</title>
              <style>
                * { box-sizing: border-box; }
                body { 
                  font-family: system-ui, -apple-system, sans-serif; 
                  line-height: 1.6; 
                  color: #262626; 
                  background: #ffffff;
                  margin: 0;
                  padding: 0;
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background: #ffffff;
                }
                .header { 
                  background: #262626; 
                  color: #ffffff; 
                  padding: 32px 24px; 
                  text-align: center; 
                  border-radius: 10px 10px 0 0; 
                }
                .header h1 { 
                  margin: 0; 
                  font-size: 24px; 
                  font-weight: 600; 
                  letter-spacing: -0.025em;
                }
                .content { 
                  background: #ffffff; 
                  padding: 32px 24px; 
                  border: 1px solid #e5e5e5;
                  border-top: none;
                  border-radius: 0 0 10px 10px; 
                }
                .content h2 { 
                  color: #171717; 
                  font-size: 20px; 
                  font-weight: 600; 
                  margin: 0 0 16px 0; 
                }
                .content p { 
                  color: #525252; 
                  margin: 0 0 16px 0; 
                }
                .button-container { 
                  text-align: center; 
                  margin: 24px 0; 
                }
                .button { 
                  display: inline-block; 
                  background: #262626; 
                  color: #ffffff; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 10px; 
                  font-weight: 500;
                  transition: background-color 0.2s;
                }
                .button:hover { 
                  background: #404040; 
                }
                .code-block { 
                  word-break: break-all; 
                  background: #f5f5f5; 
                  border: 1px solid #e5e5e5;
                  padding: 12px; 
                  border-radius: 6px; 
                  font-family: 'Roboto Mono', monospace; 
                  font-size: 14px;
                  color: #171717;
                  margin: 16px 0;
                }
                .divider {
                  height: 1px;
                  background: #e5e5e5;
                  margin: 24px 0;
                }
                .footer { 
                  color: #737373; 
                  font-size: 14px; 
                }
                .footer p { 
                  color: #737373; 
                }
                .logo {
                  font-family: 'Roboto Mono', monospace;
                  font-weight: 700;
                  letter-spacing: -0.05em;
                }
                
                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                  body { background: #0a0a0a; color: #e5e5e5; }
                  .container { background: #0a0a0a; }
                  .content { 
                    background: #171717; 
                    border-color: #262626; 
                  }
                  .content h2 { color: #ffffff; }
                  .content p { color: #a3a3a3; }
                  .code-block { 
                    background: #262626; 
                    border-color: #404040; 
                    color: #e5e5e5; 
                  }
                  .divider { background: #404040; }
                  .footer p { color: #737373; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 class="logo">MaxType</h1>
                </div>
                <div class="content">
                  <h2>Verify Your Email Address</h2>
                  <p>Thanks for joining MaxType! We're excited to help you improve your typing skills.</p>
                  <p>To complete your registration and start your typing journey, please verify your email address by clicking the button below:</p>
                  
                  <div class="button-container">
                    <a href="${url}" class="button">Verify Email Address</a>
                  </div>
                  
                  <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                  <div class="code-block">${url}</div>
                  
                  <div class="divider"></div>
                  
                  <div class="footer">
                    <p><strong>Security note:</strong> This verification link will expire in 24 hours.</p>
                    <p>If you didn't create an account with MaxType, you can safely ignore this email.</p>
                    <p>Happy typing!<br><strong>The MaxType Team</strong></p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `
      },
      generateEmailSubject: () => {
        return 'Verify your MaxType account'
      },
    },
  },
  access: {
    // Allow public user creation (signup)
    create: () => true,
    // Only allow users to read their own data or admins to read all
    read: ({ req: { user } }) => {
      if (user?.collection === 'admins') return true
      if (user?.collection === 'users') return { id: { equals: user.id } }
      return false
    },
    // Users can update their own data, admins can update all
    update: ({ req: { user } }) => {
      if (user?.collection === 'admins') return true
      if (user?.collection === 'users') return { id: { equals: user.id } }
      return false
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => user?.collection === 'admins',
  },
  fields: [
    // Explicitly define email field to ensure proper validation
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true, // Add database index for better performance
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: string | string[] | null | undefined) => {
        if (typeof value === 'string') {
          const isValid = /^[a-zA-Z0-9_-]+$/.test(value)
          if (!isValid) {
            return 'Username must contain only letters, numbers, dashes, or underscores'
          }
          if (value.length < 3 || value.length > 20) {
            return 'Username must be between 3 and 20 characters'
          }
          if (/[-_]{2,}/.test(value)) {
            return 'Username must not have consecutive dashes or underscores'
          }
          return true
        }
        return 'Invalid value'
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'language',
          type: 'select',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Swedish', value: 'sv' },
          ],
          required: true,
          defaultValue: 'en',
        },
        {
          name: 'keyboardLayout',
          type: 'select',
          options: [
            { label: 'QWERTY', value: 'qwerty' },
            { label: 'AZERTY', value: 'azerty' },
            { label: 'DVORAK', value: 'dvorak' },
            { label: 'COLEMAK', value: 'colemak' },
          ],
          required: true,
          defaultValue: 'qwerty',
        },
        {
          name: 'testDuration',
          type: 'select',
          options: [
            { label: '30 seconds', value: '30' },
            { label: '60 seconds', value: '60' },
            { label: '120 seconds', value: '120' },
          ],
          required: true,
          defaultValue: '30',
        },
        {
          name: 'showKeyboard',
          type: 'checkbox',
          label: 'Show Keyboard',
          required: true,
          defaultValue: true,
        },
        {
          name: 'theme',
          type: 'select',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ],
          required: true,
          defaultValue: 'system',
        },
      ],
    },
  ],
}
