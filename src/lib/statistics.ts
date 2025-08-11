import { UserStats } from './validation'
import type { TypingTestResult } from '../payload-types'

/**
 * Statistics computation utility for MaxType typing tests
 * Provides consistent statistical calculations for both anonymous and authenticated users
 */

/**
 * Computes typing statistics from an array of test results
 * Used for anonymous users who don't have pre-computed stats stored
 */
export function computeStatistics(results: TypingTestResult[]): UserStats {
  if (results.length === 0) {
    return {
      totalTests: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      averageWpm: 0,
      currentStreak: 0,
      lastTestDate: undefined,
    }
  }

  // Sort results by creation date (newest first)
  const sortedResults = results.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()

    // Handle invalid dates (put them at the end)
    if (isNaN(dateA) && isNaN(dateB)) return 0
    if (isNaN(dateA)) return 1
    if (isNaN(dateB)) return -1

    return dateB - dateA
  })

  const totalTests = results.length
  // Find the most recent valid date
  let lastTestDate: Date | undefined = undefined
  for (const result of sortedResults) {
    const testDate = new Date(result.createdAt)
    if (!isNaN(testDate.getTime())) {
      lastTestDate = testDate
      break
    }
  }

  // Calculate best scores
  const bestWpm = Math.max(...results.map(r => r.results.wpm))
  const bestAccuracy = Math.max(...results.map(r => r.results.accuracy))

  // Calculate average WPM
  const totalWpm = results.reduce((sum, result) => sum + result.results.wpm, 0)
  const averageWpm = Math.round((totalWpm / totalTests) * 100) / 100 // Round to 2 decimal places

  // Calculate current streak (consecutive days with at least one test)
  const currentStreak = calculateCurrentStreak(sortedResults)

  return {
    totalTests,
    bestWpm: Math.round(bestWpm * 100) / 100,
    bestAccuracy: Math.round(bestAccuracy * 100) / 100,
    averageWpm,
    currentStreak,
    lastTestDate,
  }
}

/**
 * Calculates the current daily streak from test results
 * A streak is consecutive days with at least one typing test
 */
function calculateCurrentStreak(sortedResults: TypingTestResult[]): number {
  if (sortedResults.length === 0) return 0

  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today

  let currentStreak = 0
  // eslint-disable-next-line prefer-const
  let checkDate = new Date(today)

  // Group results by day
  const resultsByDay = new Map<string, TypingTestResult[]>()

  for (const result of sortedResults) {
    const testDate = new Date(result.createdAt)

    // Skip invalid dates
    if (isNaN(testDate.getTime())) {
      continue
    }

    const dayKey = testDate.toISOString().split('T')[0] // YYYY-MM-DD format

    if (!resultsByDay.has(dayKey)) {
      resultsByDay.set(dayKey, [])
    }
    resultsByDay.get(dayKey)!.push(result)
  }

  // Check consecutive days starting from today
  while (true) {
    const dayKey = checkDate.toISOString().split('T')[0]

    if (resultsByDay.has(dayKey)) {
      currentStreak++
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // If this is the first day we're checking and there's no result,
      // check yesterday (maybe they haven't tested today yet)
      if (currentStreak === 0 && dayKey === today.toISOString().split('T')[0]) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue
      }
      // Streak broken
      break
    }
  }

  return currentStreak
}

/**
 * Filters test results by configuration for more specific statistics
 * Useful for showing statistics for specific test types, durations, or languages
 */
export function filterResultsByConfig(
  results: TypingTestResult[],
  filters: {
    language?: string
    testDuration?: string
    textType?: string
    keyboardLayout?: string
  },
): TypingTestResult[] {
  return results.filter(result => {
    if (filters.language && result.testConfig.language !== filters.language) {
      return false
    }
    if (filters.testDuration && result.testConfig.testDuration !== filters.testDuration) {
      return false
    }
    if (filters.textType && result.testConfig.textType !== filters.textType) {
      return false
    }
    if (filters.keyboardLayout && result.testConfig.keyboardLayout !== filters.keyboardLayout) {
      return false
    }
    return true
  })
}

/**
 * Computes advanced statistics including trends and improvements
 * Provides insights into user progress over time
 */
export function computeAdvancedStatistics(results: TypingTestResult[]): {
  basicStats: UserStats
  recentImprovement: {
    wpmChange: number // Change in last 5 tests vs previous 5 tests
    accuracyChange: number
    trend: 'improving' | 'stable' | 'declining' | 'insufficient_data'
  }
  configurationBests: Array<{
    language: string
    testDuration: string
    textType: string
    bestWpm: number
    bestAccuracy: number
    testsCompleted: number
    lastTestDate: Date
  }>
} {
  const basicStats = computeStatistics(results)

  // Calculate recent improvement trend
  const sortedResults = results.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()

    // Handle invalid dates (put them at the end)
    if (isNaN(dateA) && isNaN(dateB)) return 0
    if (isNaN(dateA)) return 1
    if (isNaN(dateB)) return -1

    return dateB - dateA
  })

  let recentImprovement: {
    wpmChange: number
    accuracyChange: number
    trend: 'improving' | 'stable' | 'declining' | 'insufficient_data'
  } = {
    wpmChange: 0,
    accuracyChange: 0,
    trend: 'insufficient_data',
  }

  if (sortedResults.length >= 10) {
    const recent5 = sortedResults.slice(0, 5)
    const previous5 = sortedResults.slice(5, 10)

    const recentAvgWpm = recent5.reduce((sum, r) => sum + r.results.wpm, 0) / 5
    const previousAvgWpm = previous5.reduce((sum, r) => sum + r.results.wpm, 0) / 5

    const recentAvgAccuracy = recent5.reduce((sum, r) => sum + r.results.accuracy, 0) / 5
    const previousAvgAccuracy = previous5.reduce((sum, r) => sum + r.results.accuracy, 0) / 5

    recentImprovement = {
      wpmChange: Math.round((recentAvgWpm - previousAvgWpm) * 100) / 100,
      accuracyChange: Math.round((recentAvgAccuracy - previousAvgAccuracy) * 100) / 100,
      trend: determineOverallTrend(
        recentAvgWpm - previousAvgWpm,
        recentAvgAccuracy - previousAvgAccuracy,
      ),
    }
  }

  // Calculate configuration-specific bests
  const configGroups = new Map<string, TypingTestResult[]>()

  for (const result of results) {
    const key = `${result.testConfig.language}-${result.testConfig.testDuration}-${result.testConfig.textType}`
    if (!configGroups.has(key)) {
      configGroups.set(key, [])
    }
    configGroups.get(key)!.push(result)
  }

  const configurationBests = Array.from(configGroups.entries()).map(([key, configResults]) => {
    const [language, testDuration, textType] = key.split('-')
    const sortedConfigResults = configResults.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      // Handle invalid dates (put them at the end)
      if (isNaN(dateA) && isNaN(dateB)) return 0
      if (isNaN(dateA)) return 1
      if (isNaN(dateB)) return -1

      return dateB - dateA
    })

    return {
      language,
      testDuration,
      textType,
      bestWpm: Math.max(...configResults.map(r => r.results.wpm)),
      bestAccuracy: Math.max(...configResults.map(r => r.results.accuracy)),
      testsCompleted: configResults.length,
      lastTestDate: (() => {
        // Find the most recent valid date
        for (const result of sortedConfigResults) {
          const testDate = new Date(result.createdAt)
          if (!isNaN(testDate.getTime())) {
            return testDate
          }
        }
        return new Date() // Fallback to current date
      })(),
    }
  })

  return {
    basicStats,
    recentImprovement,
    configurationBests,
  }
}

/**
 * Determines overall improvement trend based on WPM and accuracy changes
 */
function determineOverallTrend(
  wpmChange: number,
  accuracyChange: number,
): 'improving' | 'stable' | 'declining' | 'insufficient_data' {
  const wpmThreshold = 2 // Significant WPM change threshold
  const accuracyThreshold = 2 // Significant accuracy change threshold

  const wpmImproving = wpmChange > wpmThreshold
  const accuracyImproving = accuracyChange > accuracyThreshold
  const wpmDeclining = wpmChange < -wpmThreshold
  const accuracyDeclining = accuracyChange < -accuracyThreshold

  // Improving if either metric improves significantly and the other doesn't decline significantly
  if ((wpmImproving || accuracyImproving) && !wpmDeclining && !accuracyDeclining) {
    return 'improving'
  }

  // Declining if either metric declines significantly and the other doesn't improve significantly
  if ((wpmDeclining || accuracyDeclining) && !wpmImproving && !accuracyImproving) {
    return 'declining'
  }

  // Otherwise stable
  return 'stable'
}

/**
 * Generates a summary report suitable for display in UI
 */
export function generateStatsSummary(results: TypingTestResult[]): {
  totalTests: number
  bestWpm: number
  averageWpm: number
  bestAccuracy: number
  currentStreak: number
  recentActivity: string // Human-readable recent activity description
  topLanguage: string | null
  favoriteTestDuration: string | null
} {
  const stats = computeStatistics(results)

  // Find most common language and test duration
  const languageCounts = new Map<string, number>()
  const durationCounts = new Map<string, number>()

  results.forEach(result => {
    const lang = result.testConfig.language
    const duration = result.testConfig.testDuration

    languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1)
    durationCounts.set(duration, (durationCounts.get(duration) || 0) + 1)
  })

  const topLanguage =
    languageCounts.size > 0
      ? Array.from(languageCounts.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : null

  const favoriteTestDuration =
    durationCounts.size > 0
      ? Array.from(durationCounts.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : null

  // Generate recent activity description
  let recentActivity = 'No recent activity'
  if (stats.lastTestDate) {
    const daysSince = Math.floor(
      (Date.now() - stats.lastTestDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysSince === 0) {
      recentActivity = 'Active today'
    } else if (daysSince === 1) {
      recentActivity = 'Last active yesterday'
    } else if (daysSince < 7) {
      recentActivity = `Last active ${daysSince} days ago`
    } else {
      recentActivity = `Last active over a week ago`
    }
  }

  return {
    totalTests: stats.totalTests,
    bestWpm: stats.bestWpm,
    averageWpm: stats.averageWpm,
    bestAccuracy: stats.bestAccuracy,
    currentStreak: stats.currentStreak,
    recentActivity,
    topLanguage,
    favoriteTestDuration,
  }
}
