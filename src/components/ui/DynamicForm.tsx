import React from 'react'

import SignupForm from './SignupForm'

interface FormField {
  blockType: string
  name: string
  label: string
  width: number
  required: boolean
  id: string
  blockName: string
}

export interface FormData {
  createdAt: string
  updatedAt: string
  title: string
  fields: FormField[]
  submitButtonLabel: string
  confirmationType: string
  confirmationMessage: object
  redirect: object
  emails: object[] // You can define a more specific type if needed
  id: string
}

export interface FormProps {
  form: FormData
  id: string
}

const DynamicForm: React.FC<FormProps> = ({ form }) => {
  switch (form.title) {
    case 'Sign up':
      return <SignupForm form={form} id={form.id} />
    default:
      return null
  }
}

export default DynamicForm
