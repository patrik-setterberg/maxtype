# Typing Test Implementation Plan

## Project Overview

Complete rewrite of the typing test functionality using modern React 19 patterns, extracting proven algorithms from TypeThree while rebuilding everything else for performance, maintainability, and MaxType integration.

## Implementation Strategy

**Rewrite Philosophy**: Extract proven algorithms, rebuild everything else using modern best practices.

**Key Principles**:

- Single `useTypingTest()` hook for all logic
- High-precision timing with `performance.now()`
- TailwindCSS styling with MaxType's OKLCH colors
- Native PayloadCMS integration
- Accessibility-first design
- Mobile-responsive from day one
- Comprehensive test coverage

## Task Breakdown (12 Sessions)

### Phase 1: Foundation & Data Setup

#### Task 1: PayloadCMS User Collection Updates

**Complexity**: Medium
**Prerequisites**: Understanding of PayloadCMS collections
**Deliverables**:

- Add typing test fields to User collection schema
- Test results storage structure (WPM, accuracy, date, duration, etc.)
- User preferences for typing tests (test length, keyboard layout, language)
- Migration strategy for existing users

**Files to Modify**:

- `src/collections/Users.ts`
- Update Zod schemas in `src/lib/validation.ts`
- Update TypeScript types

**Acceptance Criteria**:

- User collection includes typing test result fields
- Preferences include typing-specific settings
- PayloadCMS admin panel shows new fields
- Type safety maintained throughout

---

#### Task 2: Word Data and Content Management

**Complexity**: Medium
**Prerequisites**: Task 1 completed
**Deliverables**:

- Create word datasets (English 1k, additional languages)
- Implement efficient word loading system
- Custom text support for advanced users
- Word difficulty classification system

**Files to Create**:

- `src/lib/word-data/` directory structure
- `src/lib/word-data/english-1k.ts`
- `src/lib/word-data/word-loader.ts`
- `src/lib/word-data/custom-text.ts`

**Acceptance Criteria**:

- Efficient word loading with no memory leaks
- Support for multiple languages
- Custom text input and validation
- Word datasets properly typed and tested

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

- Test completion modal with detailed results
- WPM, accuracy, and error analysis
- Results visualization (charts/graphs)
- Results storage integration with PayloadCMS

**Files to Create**:

- `src/components/typing-test/TestResults.tsx`
- `src/components/typing-test/ResultsChart.tsx`
- `src/hooks/useTestResults.ts`
- Results API integration

**Acceptance Criteria**:

- Accurate WPM and accuracy calculations
- Clear results presentation with visualizations
- Results properly stored in user account
- Guest user results handled appropriately

---

#### Task 9: Statistics and History Tracking

**Complexity**: Medium
**Prerequisites**: Task 8 completed
**Deliverables**:

- User statistics dashboard
- Historical performance tracking
- Progress charts and improvement analytics
- Personal best tracking

**Files to Create**:

- `src/components/typing-test/StatsDashboard.tsx`
- `src/components/typing-test/ProgressChart.tsx`
- `src/hooks/useUserStats.ts`
- Statistics calculation utilities

**Acceptance Criteria**:

- Clear visualization of typing progress over time
- Accurate personal best and average calculations
- Performance trends and improvement suggestions
- Data export capabilities for power users

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

- User collection updates (Task 1)
- Test result storage (Task 8)
- User preferences (Task 10)
- Statistics tracking (Task 9)

## Success Metrics

**Performance Targets**:

- Timer accuracy: <10ms drift over 60 seconds
- Input lag: <16ms (single frame at 60fps)
- Bundle size: <50KB gzipped for typing test functionality
- Lighthouse scores: 95+ for Performance, Accessibility

**User Experience Targets**:

- Mobile-friendly interface
- Screen reader compatibility
- Support for 6+ keyboard layouts
- Offline capability for basic functionality

## Risk Mitigation

**High-Risk Areas**:

- Task 4 (Timer System) - Complex timing logic
- Task 5 (Text Display) - Performance-critical rendering
- Task 6 (Input Handling) - Cross-browser compatibility
- Task 11 (Mobile/A11y) - Complex responsive design

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
