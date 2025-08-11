import {
  computeStatistics,
  filterResultsByConfig,
  computeAdvancedStatistics,
  generateStatsSummary,
} from '../statistics'
import type { TypingTestResult } from '../validation'

// Helper to create mock typing test results
function createMockResult(overrides: Partial<TypingTestResult> = {}): TypingTestResult {
  return {
    id: Math.random().toString(),
    user: null,
    sessionId: 'test-session',
    testConfig: {
      language: 'en',
      keyboardLayout: 'qwerty_us',
      testDuration: '30',
      showKeyboard: true,
      textType: 'words',
      textSource: 'Common Words',
      textContentHash: 'hash123',
    },
    results: {
      wpm: 50,
      netWpm: 48,
      accuracy: 95,
      consistency: 90,
    },
    statistics: {
      totalCharacters: 100,
      correctCharacters: 95,
      incorrectCharacters: 5,
      totalWords: 20,
      correctWords: 19,
      incorrectWords: 1,
      extraCharacters: 0,
      missedCharacters: 0,
    },
    timingData: {
      actualDuration: 30000,
      pausedDuration: 0,
      keystrokeTimings: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('Statistics Utility', () => {
  describe('computeStatistics', () => {
    test('should return zero stats for empty results', () => {
      const stats = computeStatistics([])
      expect(stats).toEqual({
        totalTests: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        averageWpm: 0,
        currentStreak: 0,
        lastTestDate: undefined,
      })
    })

    test('should compute correct stats for single result', () => {
      const result = createMockResult({
        results: { wpm: 60, netWpm: 58, accuracy: 98, consistency: 85 },
      })
      const stats = computeStatistics([result])

      expect(stats.totalTests).toBe(1)
      expect(stats.bestWpm).toBe(60)
      expect(stats.bestAccuracy).toBe(98)
      expect(stats.averageWpm).toBe(60)
      expect(stats.lastTestDate).toBeInstanceOf(Date)
    })

    test('should compute correct stats for multiple results', () => {
      const results = [
        createMockResult({
          results: { wpm: 50, netWpm: 48, accuracy: 95, consistency: 90 },
          createdAt: '2023-01-01T10:00:00Z',
        }),
        createMockResult({
          results: { wpm: 60, netWpm: 58, accuracy: 98, consistency: 85 },
          createdAt: '2023-01-02T10:00:00Z',
        }),
        createMockResult({
          results: { wpm: 55, netWpm: 53, accuracy: 96, consistency: 88 },
          createdAt: '2023-01-03T10:00:00Z',
        }),
      ]

      const stats = computeStatistics(results)

      expect(stats.totalTests).toBe(3)
      expect(stats.bestWpm).toBe(60)
      expect(stats.bestAccuracy).toBe(98)
      expect(stats.averageWpm).toBe(55) // (50 + 60 + 55) / 3
      expect(stats.lastTestDate).toEqual(new Date('2023-01-03T10:00:00Z'))
    })

    test('should calculate current streak correctly', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const twoDaysAgo = new Date(today)
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      const results = [
        createMockResult({ createdAt: today.toISOString() }),
        createMockResult({ createdAt: yesterday.toISOString() }),
        createMockResult({ createdAt: twoDaysAgo.toISOString() }),
      ]

      const stats = computeStatistics(results)
      expect(stats.currentStreak).toBe(3)
    })

    test('should handle streak with gap correctly', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const threeDaysAgo = new Date(today)
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const results = [
        createMockResult({ createdAt: today.toISOString() }),
        createMockResult({ createdAt: yesterday.toISOString() }),
        createMockResult({ createdAt: threeDaysAgo.toISOString() }), // Gap of one day
      ]

      const stats = computeStatistics(results)
      expect(stats.currentStreak).toBe(2) // Should stop at the gap
    })
  })

  describe('filterResultsByConfig', () => {
    test('should filter by language correctly', () => {
      const results = [
        createMockResult({ testConfig: { ...createMockResult().testConfig, language: 'en' } }),
        createMockResult({ testConfig: { ...createMockResult().testConfig, language: 'es' } }),
        createMockResult({ testConfig: { ...createMockResult().testConfig, language: 'en' } }),
      ]

      const filtered = filterResultsByConfig(results, { language: 'en' })
      expect(filtered).toHaveLength(2)
      expect(filtered.every(r => r.testConfig.language === 'en')).toBe(true)
    })

    test('should filter by test duration correctly', () => {
      const results = [
        createMockResult({ testConfig: { ...createMockResult().testConfig, testDuration: '30' } }),
        createMockResult({ testConfig: { ...createMockResult().testConfig, testDuration: '60' } }),
        createMockResult({ testConfig: { ...createMockResult().testConfig, testDuration: '30' } }),
      ]

      const filtered = filterResultsByConfig(results, { testDuration: '60' })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].testConfig.testDuration).toBe('60')
    })

    test('should filter by multiple criteria', () => {
      const results = [
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'en', testDuration: '30' },
        }),
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'es', testDuration: '30' },
        }),
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'en', testDuration: '60' },
        }),
      ]

      const filtered = filterResultsByConfig(results, {
        language: 'en',
        testDuration: '30',
      })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].testConfig.language).toBe('en')
      expect(filtered[0].testConfig.testDuration).toBe('30')
    })
  })

  describe('computeAdvancedStatistics', () => {
    test('should compute basic stats', () => {
      const results = [createMockResult()]
      const advanced = computeAdvancedStatistics(results)

      expect(advanced.basicStats.totalTests).toBe(1)
      expect(advanced.recentImprovement.trend).toBe('insufficient_data')
    })

    test('should compute improvement trend with sufficient data', () => {
      const results = Array.from({ length: 10 }, (_, i) => {
        return createMockResult({
          results: {
            wpm: 50 + i, // Improving WPM from 50 to 59
            netWpm: 48 + i,
            accuracy: 95,
            consistency: 90,
          },
          createdAt: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
        })
      })

      const advanced = computeAdvancedStatistics(results)
      expect(advanced.recentImprovement.trend).toBe('improving')
      expect(advanced.recentImprovement.wpmChange).toBeGreaterThan(0)
    })

    test('should compute configuration-specific bests', () => {
      const results = [
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'en', testDuration: '30' },
          results: { wpm: 50, netWpm: 48, accuracy: 95, consistency: 90 },
        }),
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'en', testDuration: '30' },
          results: { wpm: 60, netWpm: 58, accuracy: 98, consistency: 85 },
        }),
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'es', testDuration: '60' },
          results: { wpm: 45, netWpm: 43, accuracy: 92, consistency: 88 },
        }),
      ]

      const advanced = computeAdvancedStatistics(results)
      expect(advanced.configurationBests).toHaveLength(2)

      const enConfig = advanced.configurationBests.find(
        c => c.language === 'en' && c.testDuration === '30',
      )
      expect(enConfig?.bestWpm).toBe(60)
      expect(enConfig?.testsCompleted).toBe(2)
    })
  })

  describe('generateStatsSummary', () => {
    test('should generate correct summary', () => {
      const results = [
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'en', testDuration: '30' },
          results: { wpm: 50, netWpm: 48, accuracy: 95, consistency: 90 },
          createdAt: new Date().toISOString(),
        }),
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'en', testDuration: '30' },
          results: { wpm: 60, netWpm: 58, accuracy: 98, consistency: 85 },
          createdAt: new Date().toISOString(),
        }),
        createMockResult({
          testConfig: { ...createMockResult().testConfig, language: 'es', testDuration: '60' },
          results: { wpm: 45, netWpm: 43, accuracy: 92, consistency: 88 },
          createdAt: new Date().toISOString(),
        }),
      ]

      const summary = generateStatsSummary(results)

      expect(summary.totalTests).toBe(3)
      expect(summary.bestWpm).toBe(60)
      expect(summary.topLanguage).toBe('en') // Most common
      expect(summary.favoriteTestDuration).toBe('30') // Most common
      expect(summary.recentActivity).toBe('Active today')
    })

    test('should handle empty results', () => {
      const summary = generateStatsSummary([])

      expect(summary.totalTests).toBe(0)
      expect(summary.bestWpm).toBe(0)
      expect(summary.topLanguage).toBe(null)
      expect(summary.favoriteTestDuration).toBe(null)
      expect(summary.recentActivity).toBe('No recent activity')
    })

    test('should generate correct recent activity descriptions', () => {
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)

      const result = createMockResult({ createdAt: oneDayAgo.toISOString() })
      const summary = generateStatsSummary([result])

      expect(summary.recentActivity).toBe('Last active yesterday')
    })
  })

  describe('Edge cases', () => {
    test('should handle results with same WPM/accuracy', () => {
      const results = [
        createMockResult({ results: { wpm: 50, netWpm: 48, accuracy: 95, consistency: 90 } }),
        createMockResult({ results: { wpm: 50, netWpm: 48, accuracy: 95, consistency: 90 } }),
      ]

      const stats = computeStatistics(results)
      expect(stats.bestWpm).toBe(50)
      expect(stats.bestAccuracy).toBe(95)
      expect(stats.averageWpm).toBe(50)
    })

    test('should handle invalid dates gracefully', () => {
      const results = [
        createMockResult({ createdAt: 'invalid-date' }),
        createMockResult({ createdAt: new Date().toISOString() }),
      ]

      // Should not throw error
      expect(() => computeStatistics(results)).not.toThrow()
    })

    test('should round averages correctly', () => {
      const results = [
        createMockResult({ results: { wpm: 33, netWpm: 31, accuracy: 95, consistency: 90 } }),
        createMockResult({ results: { wpm: 34, netWpm: 32, accuracy: 96, consistency: 91 } }),
        createMockResult({ results: { wpm: 35, netWpm: 33, accuracy: 97, consistency: 92 } }),
      ]

      const stats = computeStatistics(results)
      expect(stats.averageWpm).toBe(34) // (33 + 34 + 35) / 3 = 34
    })
  })
})
