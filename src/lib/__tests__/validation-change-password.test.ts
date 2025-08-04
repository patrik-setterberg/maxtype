import { ChangePasswordSchema, type ChangePasswordFormData } from '../validation'

describe('ChangePasswordSchema validation', () => {
  const validData: ChangePasswordFormData = {
    currentPassword: 'currentPass123',
    newPassword: 'newPass123',
    'newPassword-repeat': 'newPass123',
  }

  describe('valid form data', () => {
    it('should accept valid change password data', () => {
      const result = ChangePasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should accept minimum length passwords', () => {
      const data: ChangePasswordFormData = {
        currentPassword: '123456', // minimum 6 characters
        newPassword: 'abcdef', // minimum 6 characters
        'newPassword-repeat': 'abcdef',
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept maximum length passwords', () => {
      const longPassword = 'a'.repeat(50) // maximum 50 characters
      const data: ChangePasswordFormData = {
        currentPassword: 'current123',
        newPassword: longPassword,
        'newPassword-repeat': longPassword,
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('currentPassword validation', () => {
    it('should reject missing current password', () => {
      const data = { ...validData, currentPassword: '' }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['currentPassword'],
              code: 'too_small',
              message: 'Current password is required.',
            }),
          ]),
        )
      }
    })

    it('should reject undefined current password', () => {
      const data: Partial<ChangePasswordFormData> = {
        newPassword: validData.newPassword,
        'newPassword-repeat': validData['newPassword-repeat'],
        // currentPassword intentionally omitted
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['currentPassword'],
              code: 'invalid_type',
              message: 'Current password is required.',
            }),
          ]),
        )
      }
    })
  })

  describe('newPassword validation', () => {
    it('should reject missing new password', () => {
      const data = { ...validData, newPassword: '' }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword'],
              code: 'too_small',
              message: 'New password must be at least 6 characters.',
            }),
          ]),
        )
      }
    })

    it('should reject new password that is too short', () => {
      const data: ChangePasswordFormData = {
        currentPassword: 'current123',
        newPassword: '12345', // 5 characters, too short
        'newPassword-repeat': '12345',
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword'],
              code: 'too_small',
              message: 'New password must be at least 6 characters.',
            }),
          ]),
        )
      }
    })

    it('should reject new password that is too long', () => {
      const tooLongPassword = 'a'.repeat(51) // 51 characters, too long
      const data: ChangePasswordFormData = {
        currentPassword: 'current123',
        newPassword: tooLongPassword,
        'newPassword-repeat': tooLongPassword,
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword'],
              code: 'too_big',
              message: 'New password must be at most 50 characters.',
            }),
          ]),
        )
      }
    })

    it('should reject undefined new password', () => {
      const data: Partial<ChangePasswordFormData> = {
        currentPassword: validData.currentPassword,
        'newPassword-repeat': validData['newPassword-repeat'],
        // newPassword intentionally omitted
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword'],
              code: 'invalid_type',
              message: 'New password is required.',
            }),
          ]),
        )
      }
    })
  })

  describe('newPassword-repeat validation', () => {
    it('should reject missing password confirmation', () => {
      const data = { ...validData, 'newPassword-repeat': '' }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        // When the field is empty, the password mismatch error takes precedence
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword-repeat'],
              code: 'custom',
              message: 'New passwords do not match',
            }),
          ]),
        )
      }
    })

    it('should reject undefined password confirmation', () => {
      const data: Partial<ChangePasswordFormData> = {
        currentPassword: validData.currentPassword,
        newPassword: validData.newPassword,
        // 'newPassword-repeat' intentionally omitted
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword-repeat'],
              code: 'invalid_type',
              message: 'New password confirmation is required.',
            }),
          ]),
        )
      }
    })
  })

  describe('password matching validation', () => {
    it('should reject when new passwords do not match', () => {
      const data: ChangePasswordFormData = {
        currentPassword: 'current123',
        newPassword: 'newPassword1',
        'newPassword-repeat': 'newPassword2', // Different password
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword-repeat'],
              code: 'custom',
              message: 'New passwords do not match',
            }),
          ]),
        )
      }
    })

    it('should reject when new password is same as current password', () => {
      const samePassword = 'samePassword123'
      const data: ChangePasswordFormData = {
        currentPassword: samePassword,
        newPassword: samePassword, // Same as current
        'newPassword-repeat': samePassword,
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword'],
              code: 'custom',
              message: 'New password must be different from current password',
            }),
          ]),
        )
      }
    })
  })

  describe('multiple validation errors', () => {
    it('should return multiple errors when multiple fields are invalid', () => {
      const data: ChangePasswordFormData = {
        currentPassword: '', // Empty current password
        newPassword: '123', // Too short new password
        'newPassword-repeat': 'differentPassword', // Doesn't match new password
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(3)

        // Should have current password error
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['currentPassword'],
              message: 'Current password is required.',
            }),
          ]),
        )

        // Should have new password too short error
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword'],
              message: 'New password must be at least 6 characters.',
            }),
          ]),
        )

        // Should have passwords don't match error
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['newPassword-repeat'],
              message: 'New passwords do not match',
            }),
          ]),
        )
      }
    })
  })

  describe('edge cases', () => {
    it('should handle passwords with special characters', () => {
      const data: ChangePasswordFormData = {
        currentPassword: 'current!@#$%^&*()',
        newPassword: 'new!@#$%^&*()',
        'newPassword-repeat': 'new!@#$%^&*()',
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle passwords with unicode characters', () => {
      const data: ChangePasswordFormData = {
        currentPassword: 'пароль123',
        newPassword: 'новый_пароль456',
        'newPassword-repeat': 'новый_пароль456',
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle passwords with whitespace', () => {
      const data: ChangePasswordFormData = {
        currentPassword: 'current password with spaces',
        newPassword: 'new password with spaces',
        'newPassword-repeat': 'new password with spaces',
      }
      const result = ChangePasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
