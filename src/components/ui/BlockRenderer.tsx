import React from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

interface Block {
  blockType: string
  id?: string | null
  form?: string | { slug?: string }
}

interface BlockRendererProps {
  block: Block
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  switch (block.blockType) {
    case 'formBlock':
      // Extract form slug from either string ID or object
      const formSlug = typeof block.form === 'object' && block.form?.slug 
        ? block.form.slug 
        : block.form
      
      if (formSlug === 'login') {
        return <LoginForm />
      }
      if (formSlug === 'signup') {
        return <SignupForm />
      }
      return null
      
    default:
      // Handle unknown block types gracefully
      console.warn(`Unknown block type: ${block.blockType}`)
      return null
  }
}

export default BlockRenderer