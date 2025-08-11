# Typing Test Implementation Plan

## Project Overview

Complete rewrite of the typing test functionality using modern React 19 patterns, extracting proven algorithms from TypeThree while rebuilding everything else for performance, maintainability, and MaxType integration.

## Implementation Strategy

**Rewrite Philosophy**: Extract proven algorithms, rebuild everything else using modern best practices.

**Key Principles**:

- Single `useTypingTest()` hook for all logic
- High-precision timing with `performance.now()`
- TailwindCSS styling with MaxType's OKLCH colors
- Native PayloadCMS integration with separate TypingTestResults collection
- Anonymous and authenticated user support
- Rich analytics and leaderboard capabilities
- Accessibility-first design
- Mobile-responsive from day one
- Comprehensive test coverage

## Enhanced Architecture

### Data Storage Strategy

**TypingTestResults Collection** (Standalone):

- Stores ALL typing test results (authenticated + anonymous users)
- Enables rich analytics, leaderboards, and usage tracking
- Supports advanced features like word difficulty analysis
- Scales efficiently with thousands of test results

**Users Collection** (Summary Data):

- User preferences for typing tests
- Computed summary statistics (derived from TypingTestResults)
- Personal bests and achievement tracking

**Benefits**:

- Track anonymous user behavior and trends
- Analyze popular languages, difficult words, usage patterns
- Build global leaderboards and competition features
- Enable A/B testing of different content or UI approaches
- Better performance and scalability

## Task Breakdown (15 Sessions)

### Phase 1: Foundation & Data Setup

#### ✅ Task 1: PayloadCMS Collections Setup - **COMPLETED**

**Status**: ✅ **COMPLETED**
**Complexity**: Medium
**Prerequisites**: Understanding of PayloadCMS collections
**Deliverables**: ✅ **ALL COMPLETED**

- ✅ Create new TypingTestResults collection for all test data
- ✅ Add typing test preferences to existing User collection
- ✅ Add computed summary statistics to User collection
- ✅ Anonymous user session tracking setup

**Files Created**: ✅

- ✅ `src/collections/TypingTestResults.ts` - Comprehensive collection with all typing test metrics

**Files Modified**: ✅

- ✅ `src/collections/Users.ts` - Added simplified typing statistics fields and hooks
- ✅ `src/lib/validation.ts` - Added TypingTestResultSchema and UserStatsSchema
- ✅ `src/payload-types.ts` - Auto-generated TypeScript types updated

**TypingTestResults Collection Structure**:

- User ID (optional - null for anonymous users)
- Session ID for anonymous user tracking
- Comprehensive test metrics (WPM, accuracy, characters, words)
- Test configuration (language, duration, keyboard layout)
- Timestamps and metadata
- Incorrect words list for analysis

**User Collection Updates**:

- Enhanced typing test preferences
- Computed summary statistics (best WPM, average, total tests)
- Personal achievement tracking

**Acceptance Criteria**: ✅ **ALL MET**

- ✅ TypingTestResults collection created with proper access controls
- ✅ User preferences include typing-specific settings (language, keyboard layout, text type)
- ✅ Anonymous user results can be stored and tracked via sessionId
- ✅ PayloadCMS admin panel shows both collections properly
- ✅ Type safety maintained throughout with auto-generated TypeScript types
- ✅ Performance optimized with proper indexing and simplified user statistics

**Additional Achievements**:

- ✅ Fixed PayloadCMS JWT authentication issues by simplifying nested statistics
- ✅ Created comprehensive statistics utility (`src/lib/statistics.ts`) for anonymous users
- ✅ Added security sanitization for custom text input
- ✅ Implemented 142 comprehensive tests including 17 statistics tests

---

#### ✅ Additional Task 1 Enhancement: Text Type System - **COMPLETED**

**Status**: ✅ **COMPLETED**
**Complexity**: Medium
**Prerequisites**: ✅ Task 1 base implementation
**Note**: This enhancement was completed as part of Task 1 implementation
**Deliverables**: ✅ **ALL COMPLETED**

- ✅ Add text type support to TypingTestResults collection
- ✅ Add text type preference to User collection
- ✅ Update Zod validation schemas for text types
- ✅ Prepare data models for multiple content types

**Text Types Implemented**: ✅

- ✅ **Random Words**: Traditional word-by-word typing practice
- ✅ **Random Sentences**: Sentence-based practice with proper grammar and flow
- ✅ **Full Paragraphs**: Literary excerpts, quotes, coherent passages
- ✅ **Punctuation Practice**: Technical writing with complex formatting (quotes, parentheses, special characters)
- ✅ **Custom Text**: User-imported text with security sanitization and validation

**Files Modified**: ✅

- ✅ `src/collections/TypingTestResults.ts` - Added textType and textSource fields
- ✅ `src/collections/Users.ts` - Added textType preference with default 'words'
- ✅ `src/lib/validation.ts` - Added textType validation enum
- ✅ `src/components/ui/PreferenceFormFields.tsx` - Added text type selector UI with custom text area
- ✅ `src/lib/utils.ts` - Added security sanitization functions
- ✅ `src/components/ui/textarea.tsx` - Added shadcn/ui Textarea component

**Additional Files Created**:

- ✅ `src/lib/__tests__/text-security.test.ts` - Comprehensive security tests for custom text

**Collection Schema Updates**: ✅

**TypingTestResults Collection**: ✅

- ✅ `textType` field: `'words' | 'sentences' | 'paragraphs' | 'punctuation' | 'custom'`
- ✅ `textSource` field: optional string for content attribution
- ✅ `textContentHash` field: hash of content for consistency analysis

**Users Collection**: ✅

- ✅ `textType` preference with default `'words'`
- ✅ Default values and hooks to prevent login issues
- ✅ Simplified statistics structure for PayloadCMS compatibility

**Acceptance Criteria**: ✅ **ALL MET**

- ✅ TypingTestResults can track and categorize different text types (5 types including custom)
- ✅ Users can set text type preferences in their profile with UI selector
- ✅ Validation schemas enforce proper text type enum values with Zod
- ✅ PayloadCMS admin shows text type fields properly
- ✅ All existing tests continue to pass (142 tests total)
- ✅ Type safety maintained throughout with TypeScript

**Additional Security Features**:

- ✅ Custom text input sanitization to prevent XSS attacks
- ✅ Content validation with alphanumeric ratio checks
- ✅ Length limits and security filtering
- ✅ Comprehensive security test coverage

---

#### Task 2: Word Data and Content Management

**Complexity**: Medium
**Prerequisites**: Tasks 1 and 1.5 completed
**Deliverables**:

- Create comprehensive content for all 4 text types across supported languages
- Implement efficient content loading system with type/language switching
- Content difficulty classification and source attribution system
- Language-specific content with proper character support
- Custom text import support for advanced users

**Files to Create**:

- `src/lib/word-data/` directory structure
- `src/lib/word-data/english-1k.ts`
- `src/lib/word-data/spanish-1k.ts`
- `src/lib/word-data/french-1k.ts`
- `src/lib/word-data/german-1k.ts`
- `src/lib/word-data/swedish-1k.ts`
- `src/lib/word-data/portuguese-1k.ts`
- `src/lib/word-data/word-loader.ts`
- `src/lib/word-data/custom-text.ts`
- `src/lib/keyboard-layouts/layout-definitions.ts`

**Enhanced Language Support**:

**Supported Languages**:

- English (en) - 1000+ common words
- Spanish (es) - 1000+ common words with proper accents
- French (fr) - 1000+ common words with accents (é, è, à, ç, etc.)
- German (de) - 1000+ common words with umlauts (ä, ö, ü, ß)
- Swedish (sv) - 1000+ common words with Swedish characters (å, ä, ö)
- Portuguese (pt) - 1000+ common words with Portuguese accents (ã, ç, é, etc.)

**Keyboard Layout Definitions**:

- QWERTY (US English) - Standard US layout
- QWERTY (Swedish) - Swedish-specific keys (å, ä, ö)
- AZERTY (French) - French layout with proper accent key placement
- QWERTZ (German) - German layout with ü, ö, ä, ß placement
- QWERTY (Spanish) - Spanish layout with ñ and accent support
- QWERTY (Portuguese) - Portuguese layout with ã, ç, and accent keys
- DVORAK (US) - Alternative US layout
- COLEMAK - Alternative optimized layout

**Word Dataset Features**:

- Frequency-based word selection (most common words first)
- Proper accent and special character inclusion
- Difficulty classification (beginner, intermediate, advanced)
- Category tagging (nouns, verbs, adjectives, etc.)
- Cultural appropriateness filtering

**Acceptance Criteria**:

- Efficient word loading with no memory leaks
- Complete support for all 6 languages with proper special characters
- Accurate keyboard layout definitions matching physical keyboards
- Custom text input and validation
- Word datasets properly typed and tested
- Language-keyboard layout correlation logic implemented
- Visual keyboard component works with all layouts

---

#### Task 3: Core Algorithms and Utilities

**Complexity**: Medium
**Prerequisites**: Tasks 1-2 completed
**Deliverables**:

- Extract and modernize scoring algorithms from TypeThree
- High-precision timing utilities
- Character comparison and accuracy calculations
- Performance optimization utilities

**Files to Create**:

- `src/lib/typing-test/scoring.ts`
- `src/lib/typing-test/timing.ts`
- `src/lib/typing-test/text-analysis.ts`
- `src/lib/typing-test/utils.ts`
- Comprehensive test suite for all algorithms

**Acceptance Criteria**:

- All algorithms have >95% test coverage
- Performance benchmarks show improvement over TypeThree
- TypeScript types for all data structures
- Documentation for complex algorithms

---

### Phase 2: Core Components

#### Task 4: High-Precision Timer System

**Complexity**: High
**Prerequisites**: Task 3 completed
**Deliverables**:

- Accurate timer using `performance.now()`
- Pause/resume functionality with focus detection
- Timer state management with React 19 patterns
- Visual countdown component

**Files to Create**:

- `src/components/typing-test/TestTimer.tsx`
- `src/hooks/useTestTimer.ts`
- `src/lib/typing-test/timer.ts`
- Timer-specific tests

**Acceptance Criteria**:

- Timer accuracy within 10ms over 60 seconds
- Proper pause/resume on window focus loss
- Smooth visual countdown animation
- No memory leaks or timing drift

---

#### Task 5: Text Display and Highlighting Engine

**Complexity**: High
**Prerequisites**: Tasks 3-4 completed
**Deliverables**:

- Real-time text highlighting component
- Caret positioning and animation
- Word wrapping and scroll management
- Error state visualization

**Files to Create**:

- `src/components/typing-test/TestDisplay.tsx`
- `src/components/typing-test/TestCaret.tsx`
- `src/components/typing-test/TestWord.tsx`
- `src/hooks/useTextHighlighting.ts`

**Acceptance Criteria**:

- Smooth character-by-character highlighting
- Proper caret positioning and animation
- Efficient re-rendering (no unnecessary updates)
- Responsive design works on all screen sizes

---

#### Task 6: Input Handling and Keyboard Events

**Complexity**: High  
**Prerequisites**: Tasks 4-5 completed
**Deliverables**:

- Hidden input component for typing capture
- Keyboard event handling with proper validation
- Multi-layout support and character mapping
- Input state management integration

**Files to Create**:

- `src/components/typing-test/HiddenInput.tsx`
- `src/hooks/useKeyboardInput.ts`
- `src/lib/typing-test/keyboard-layouts.ts`
- Input handling tests

**Acceptance Criteria**:

- Accurate capture of all typing events
- Support for 6 keyboard layouts minimum
- Proper handling of special keys (backspace, space, etc.)
- No input lag or missed keystrokes

---

### Phase 3: Advanced Features

#### Task 7: Visual Keyboard Component

**Complexity**: Medium
**Prerequisites**: Task 6 completed
**Deliverables**:

- Interactive visual keyboard
- Real-time key highlighting (pressed/correct/incorrect)
- Multiple layout support with proper key mapping
- Responsive design for different screen sizes

**Files to Create**:

- `src/components/typing-test/TestKeyboard.tsx`
- `src/components/typing-test/KeyboardKey.tsx`
- Keyboard layout definitions
- Visual keyboard tests

**Acceptance Criteria**:

- Accurate visual representation of physical keyboards
- Real-time highlighting matches actual typing
- Responsive design for mobile and desktop
- Proper accessibility attributes

---

#### Task 8: Results and Scoring System

**Complexity**: Medium  
**Prerequisites**: Tasks 3, 7 completed
**Deliverables**:

- Test completion modal with detailed results matching TypeThree's comprehensive display
- WPM, accuracy, and error analysis with keyboard shortcuts (Enter/Escape to restart)
- Results visualization (charts/graphs) showing improvement trends
- Results storage integration with TypingTestResults collection
- Anonymous user session tracking and result storage
- Personal best detection and achievement notifications

**Files to Create**:

- `src/components/typing-test/TestResults.tsx`
- `src/components/typing-test/ResultsChart.tsx`
- `src/hooks/useTestResults.ts`
- `src/api/typing-test-results.ts` (API endpoints)
- `src/lib/typing-test/results-storage.ts`

**Key Features**:

- Store results for both authenticated and anonymous users
- Generate session IDs for anonymous user tracking
- Update user summary statistics automatically
- Handle personal best detection and updates
- Support for keyboard shortcuts in results screen

**Acceptance Criteria**:

- Accurate WPM and accuracy calculations matching TypeThree algorithms
- Clear results presentation with comprehensive statistics display
- Results properly stored in TypingTestResults collection
- Anonymous user results stored with session tracking
- User summary statistics updated automatically
- Personal best detection and celebration
- Keyboard navigation (Enter/Escape) works in results screen

---

#### Task 9: User Statistics and History Tracking

**Complexity**: Medium
**Prerequisites**: Task 8 completed
**Deliverables**:

- User statistics dashboard aggregating data from TypingTestResults collection
- Historical performance tracking with time-series analysis
- Progress charts and improvement analytics
- Personal best tracking with achievement system
- Data aggregation utilities for computing user summaries

**Files to Create**:

- `src/components/typing-test/StatsDashboard.tsx`
- `src/components/typing-test/ProgressChart.tsx`
- `src/components/typing-test/PersonalBests.tsx`
- `src/hooks/useUserStats.ts`
- `src/lib/typing-test/stats-aggregation.ts`
- `src/api/user-statistics.ts`

**Key Features**:

- Query TypingTestResults collection for user's historical data
- Compute rolling averages, improvement trends, consistency metrics
- Achievement system (milestones, streaks, personal bests)
- Detailed breakdowns by language, test length, time period
- Export functionality for personal data analysis

**Acceptance Criteria**:

- Clear visualization of typing progress over time from TypingTestResults data
- Accurate personal best and rolling average calculations
- Performance trends and improvement suggestions based on historical data
- Achievement notifications for milestones and personal bests
- Data export capabilities for power users
- Efficient queries that don't impact performance with large datasets

---

### Phase 4: Integration & Polish

#### Task 10: Authentication Integration and User Data

**Complexity**: Medium
**Prerequisites**: Tasks 1, 8, 9 completed
**Deliverables**:

- Integration with MaxType's auth system
- Guest vs. authenticated user experience
- Data migration from localStorage to user account
- Preference synchronization

**Files to Modify**:

- Main typing test component
- User preference management
- Auth-dependent features

**Acceptance Criteria**:

- Seamless experience for both guest and authenticated users
- Automatic data migration on user registration/login
- Proper preference synchronization across devices
- Privacy-compliant guest data handling

---

#### Task 11: Mobile Responsiveness and Accessibility

**Complexity**: High
**Prerequisites**: Tasks 5, 7 completed
**Deliverables**:

- Mobile-optimized typing interface
- Touch-friendly controls and virtual keyboard handling
- Screen reader support and ARIA labels
- Keyboard navigation for non-typing interactions

**Files to Modify**:

- All typing test components
- Add accessibility utilities
- Mobile-specific styling

**Acceptance Criteria**:

- Smooth typing experience on mobile devices
- Full screen reader compatibility
- Proper keyboard navigation for settings/results
- WCAG 2.1 AA compliance

---

#### Task 12: Testing Coverage and Performance Optimization

**Complexity**: High
**Prerequisites**: All previous tasks completed
**Deliverables**:

- Comprehensive test suite (unit, integration, e2e)
- Performance benchmarks and optimizations
- Bundle size analysis and optimization
- Error boundary implementation

**Files to Create**:

- Test files for all components and hooks
- Performance testing utilities
- Error boundaries and fallback components
- Build optimization configuration

**Acceptance Criteria**:

- > 95% test coverage for typing test functionality
- Performance benchmarks meet or exceed TypeThree
- Bundle size optimized for fast loading
- Robust error handling throughout

---

### Phase 5: Advanced Features & Analytics

#### Task 13: Leaderboard System

**Complexity**: High
**Prerequisites**: Tasks 1, 8, 9 completed
**Deliverables**:

- Global leaderboards with multiple categories and time periods
- Real-time ranking updates and competition features
- Anonymous and authenticated user leaderboard participation
- Leaderboard API endpoints and caching strategies
- Anti-cheating measures and result validation

**Files to Create**:

- `src/components/typing-test/Leaderboards.tsx`
- `src/components/typing-test/LeaderboardCard.tsx`
- `src/components/typing-test/LeaderboardFilters.tsx`
- `src/api/leaderboards.ts`
- `src/lib/typing-test/leaderboard-logic.ts`
- `src/hooks/useLeaderboards.ts`

**Leaderboard Categories**:

- Global WPM rankings (daily, weekly, monthly, all-time)
- Language-specific leaderboards
- Test duration categories (30s, 60s, 120s)
- Accuracy-focused leaderboards (minimum WPM threshold)
- Consistency rankings (lowest standard deviation)

**Key Features**:

- Real-time updates when users complete tests
- Anonymous users can appear on leaderboards (with session tracking)
- Multiple ranking algorithms (WPM, accuracy-weighted, consistency)
- Leaderboard history and archived periods
- User's current rank and progress tracking
- Social features like challenging friends

**Acceptance Criteria**:

- Multiple leaderboard categories function correctly
- Real-time updates work smoothly without performance issues
- Anonymous users can participate and track their position
- Anti-cheating measures prevent obviously invalid results
- Leaderboards load quickly with proper caching
- Mobile-responsive leaderboard interface
- Users can see their ranking progress over time

---

#### Task 14: Admin Analytics Dashboard

**Complexity**: High
**Prerequisites**: Task 1 completed (TypingTestResults collection)
**Deliverables**:

- Comprehensive analytics dashboard for MaxType administrators
- Usage statistics and user behavior analysis
- Word difficulty analysis and content optimization insights
- Performance monitoring and system health metrics
- Data export capabilities for deeper analysis

**Files to Create**:

- `src/components/admin/AnalyticsDashboard.tsx`
- `src/components/admin/UsageMetrics.tsx`
- `src/components/admin/WordAnalysis.tsx`
- `src/components/admin/UserBehaviorCharts.tsx`
- `src/components/admin/SystemHealth.tsx`
- `src/api/admin-analytics.ts`
- `src/lib/analytics/data-aggregation.ts`
- `src/lib/analytics/difficulty-analysis.ts`

**Analytics Features**:

**Usage Analytics**:

- Total tests completed (daily, weekly, monthly trends)
- Anonymous vs authenticated user ratios
- Popular test configurations (language, duration, keyboard layout)
- Peak usage times and geographic distribution
- User retention and engagement metrics

**Content Analytics**:

- Most difficult words across all tests
- Language preference trends and popularity
- Common error patterns and typing mistakes
- Word completion rates and accuracy by position
- Text source effectiveness (random words vs quotes)

**User Journey Analytics**:

- Anonymous to registered user conversion rates
- User improvement trajectories and learning curves
- Drop-off points in tests and completion rates
- Popular settings combinations and user preferences
- Feature usage statistics (keyboard display, themes, etc.)

**System Performance Analytics**:

- Database query performance monitoring
- API response times and error rates
- User session duration and activity patterns
- Resource utilization and scaling insights

**Acceptance Criteria**:

- Comprehensive analytics dashboard accessible to admins only
- Real-time and historical data visualization
- Word difficulty analysis provides actionable insights
- User behavior patterns clearly identified
- System performance monitoring shows key metrics
- Data export functionality works for all major metrics
- Dashboard is responsive and loads quickly
- Privacy-compliant analytics (no PII exposure)

---

#### Task 15: Anonymous User Session Management

**Complexity**: Medium
**Prerequisites**: Task 1, 8 completed
**Deliverables**:

- Anonymous user session tracking and management
- Guest user experience optimization
- Session persistence and data migration on registration
- Privacy-compliant anonymous analytics
- Seamless transition from anonymous to authenticated experience

**Files to Create**:

- `src/lib/session/anonymous-session.ts`
- `src/hooks/useAnonymousSession.ts`
- `src/lib/session/session-migration.ts`
- `src/components/typing-test/GuestWelcome.tsx`
- `src/lib/privacy/anonymous-data.ts`

**Session Management Features**:

**Anonymous Session Creation**:

- Generate unique session IDs for anonymous users
- Store session data in secure, privacy-compliant way
- Track session duration and test completion
- Handle session expiration and cleanup

**Guest User Experience**:

- Welcome messaging explaining guest vs registered benefits
- Temporary result storage and progress tracking
- Encouragement to register for permanent history
- Clear privacy notices about data collection

**Data Migration System**:

- Seamless migration of guest results to user account on registration
- Preserve test history, personal bests, and preferences
- Handle edge cases and data conflicts gracefully
- Cleanup anonymous session data after migration

**Privacy Compliance**:

- Clear data collection notices for anonymous users
- GDPR-compliant session management
- Data retention policies for anonymous results
- Easy opt-out mechanisms for tracking

**Acceptance Criteria**:

- Anonymous users can complete tests and see results
- Session tracking works reliably across browser sessions
- Guest users receive appropriate encouragement to register
- Data migration on registration is seamless and complete
- Privacy compliance measures are properly implemented
- No PII is collected from anonymous users
- Session cleanup prevents data accumulation
- Performance impact of session management is minimal

---

## Integration Points

### Main Integration Component

**File**: `src/components/typing-test/TypingTest.tsx`
**Responsibilities**:

- Orchestrates all sub-components
- Manages overall test state
- Integrates with MaxType's existing systems

### Custom Hook Architecture

```typescript
// Primary hook combining all functionality
const useTypingTest = (config: TypingTestConfig) => {
  // Combines timer, input, scoring, and display logic
  // Returns clean interface for components
}
```

### PayloadCMS Integration Points

- **TypingTestResults Collection** (Task 1) - Standalone collection for all test results
- **User Collection Updates** (Task 1) - Enhanced preferences and summary statistics
- **Test Result Storage** (Task 8) - API endpoints for storing and retrieving results
- **User Statistics** (Task 9) - Aggregation from TypingTestResults collection
- **Leaderboards** (Task 13) - Real-time ranking queries and caching
- **Admin Analytics** (Task 14) - Advanced reporting and data analysis
- **Anonymous Session Management** (Task 15) - Privacy-compliant guest user tracking

## Success Metrics

**Performance Targets**:

- Timer accuracy: <10ms drift over 60 seconds
- Input lag: <16ms (single frame at 60fps)
- Bundle size: <50KB gzipped for typing test functionality
- Lighthouse scores: 95+ for Performance, Accessibility

**User Experience Targets**:

- Mobile-friendly interface
- Screen reader compatibility
- Support for 8+ keyboard layouts across 6 languages
- Proper special character and accent support
- Offline capability for basic functionality

## Risk Mitigation

**High-Risk Areas**:

- Task 4 (Timer System) - Complex timing logic
- Task 5 (Text Display) - Performance-critical rendering
- Task 6 (Input Handling) - Cross-browser compatibility
- Task 11 (Mobile/A11y) - Complex responsive design
- Task 17 (Advanced Keyboard Layouts) - Complex multi-language keyboard handling

**Mitigation Strategies**:

- Prototype critical functionality early
- Comprehensive testing at each phase
- Performance benchmarking throughout development
- Regular accessibility audits

## Session Handoff Strategy

Each task includes:

- **Context File**: Quick recap of current state
- **File Inventory**: Exact files modified/created
- **Testing Status**: What's tested, what needs testing
- **Next Steps**: Clear path forward for next session

This ensures any task can be picked up fresh in a new session with minimal context switching overhead.

---

### Phase 6: Language & Localization Enhancements

#### Task 16: Enhanced Language Support Implementation

**Complexity**: Medium
**Prerequisites**: Task 2 completed
**Deliverables**:

- Implement comprehensive language support for typing tests
- Create word datasets for all 6 supported languages
- Language-specific content curation and quality assurance
- Proper handling of accents and special characters

**Files to Create**:

- Language-specific word datasets with proper character encoding
- Language detection and switching utilities
- Special character input handling logic

**Language-Specific Features**:

- **Spanish**: Support for ñ, accented vowels (á, é, í, ó, ú, ü)
- **French**: Support for é, è, à, ç, ô, î, and other French accents
- **German**: Support for umlauts (ä, ö, ü) and ß (eszett)
- **Swedish**: Support for å, ä, ö characters
- **Portuguese**: Support for ã, ç, é, á, ô, and Portuguese-specific accents

**Acceptance Criteria**:

- All 6 languages have high-quality, culturally appropriate word datasets
- Special characters display and input correctly in typing tests
- Language switching works seamlessly without bugs
- Word selection algorithms respect language-specific frequency patterns

---

#### Task 17: Advanced Keyboard Layout System

**Complexity**: High
**Prerequisites**: Task 16 completed
**Deliverables**:

- Complete keyboard layout definitions for all supported languages
- Visual keyboard component supporting all layouts
- Accurate key highlighting for language-specific characters
- Layout-language correlation and smart defaults

**Files to Create**:

- `src/lib/keyboard-layouts/qwerty-us.ts`
- `src/lib/keyboard-layouts/qwerty-swedish.ts`
- `src/lib/keyboard-layouts/azerty-french.ts`
- `src/lib/keyboard-layouts/qwertz-german.ts`
- `src/lib/keyboard-layouts/qwerty-spanish.ts`
- `src/lib/keyboard-layouts/qwerty-portuguese.ts`
- `src/lib/keyboard-layouts/dvorak-us.ts`
- `src/lib/keyboard-layouts/colemak.ts`
- `src/lib/keyboard-layouts/layout-matcher.ts`

**Advanced Features**:

- **Smart Layout Detection**: Suggest appropriate keyboard layout based on selected language
- **Multi-layer Support**: Handle shift, alt, and other modifier keys properly
- **Dead Key Support**: Proper handling of dead keys for accents in various layouts
- **Visual Accuracy**: Keyboard layouts match actual physical keyboard appearance
- **Accessibility**: Screen reader support for keyboard layout descriptions

**Layout-Language Correlations**:

- English → QWERTY (US), DVORAK, COLEMAK
- Spanish → QWERTY (Spanish) with ñ key placement
- French → AZERTY with proper accent key locations
- German → QWERTZ with ü, ö, ä, ß key placement
- Swedish → QWERTY (Swedish) with å, ä, ö keys
- Portuguese → QWERTY (Portuguese) with ã, ç positioning

**Acceptance Criteria**:

- All keyboard layouts render accurately with proper key positioning
- Real-time highlighting works correctly for all language-specific characters
- Layout switching is smooth and maintains user context
- Smart defaults suggest appropriate layouts for selected languages
- Keyboard layouts are accessible and work with assistive technologies
- Performance is optimized (no lag during typing with complex layouts)
