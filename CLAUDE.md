# CLAUDE.md

Project instructions for Claude Code. This file is automatically loaded at the start of each session.

## Quick Commands

```bash
yarn start            # Expo dev server (choose platform from menu)
yarn ios              # iOS Simulator
yarn android          # Android Emulator
yarn web              # Web browser
yarn lint             # Run ESLint
```

## Remember Shortcuts

### QNEW
When I type "qnew", this means:
```
Understand all BEST PRACTICES listed in this CLAUDE.md file.
Your code MUST ALWAYS follow these best practices.
Read the entire file carefully before proceeding.
Confirm: "Ready. What would you like to build?"
```

### QPLAN
When I type "qplan", this means:
```
Analyze similar parts of the codebase and determine whether your plan:
- Is consistent with the rest of the codebase
- Introduces minimal changes
- Reuses existing components and patterns
- Follows React Native/Expo best practices
- Maintains the established architecture
- Uses existing hooks, utilities, and theme constants

Explicitly state what existing patterns you're following.
```

### QCODE
When I type "qcode", this means:
```
Implement your plan following these steps:

1. Create/modify files according to the plan
2. Run: yarn lint (ESLint + auto-fix)
3. Run: npx tsc --noEmit (TypeScript check)
4. Run: yarn test (if tests exist)
5. If any step fails, fix issues and re-run steps 2-4

Only mark complete when all checks pass.
```

### QCHECK
When I type "qcheck", this means:
```
You are a SKEPTICAL senior React Native developer.

For every MAJOR code change you introduced:
1. Review against "Component Patterns" checklist
2. Review against "Type Safety" checklist
3. Review against "Performance" checklist
4. Review against "Accessibility" checklist
5. Review against "Error Handling" checklist

Be critical. Question everything. Look for potential issues.
```

### QCHECKC
When I type "qcheckc", this means:
```
You are a SKEPTICAL senior React Native developer.

For every MAJOR component you added or edited:
- Apply the "Component Patterns" checklist
- Apply the "Performance" checklist (memo, useCallback, useMemo)
- Apply the "Accessibility" checklist
- Check for unnecessary re-renders

Skip minor changes like whitespace or comment updates.
```

### QCHECKT
When I type "qcheckt", this means:
```
You are a SKEPTICAL senior React Native developer.

For every MAJOR test you added or edited:
- Tests cover happy path AND error states
- Tests are isolated and don't depend on order
- Async operations are properly awaited
- Mocks are minimal and realistic

Skip minor test updates.
```

### QUX
When I type "qux", this means:
```
Imagine you are a human QA tester for the feature you implemented.

Output a comprehensive list of test scenarios covering:
1. Happy path (successful user flow)
2. Loading states (skeleton, spinner, placeholder)
3. Error states (network failure, API error, empty data)
4. Edge cases (empty lists, long text, special characters)
5. Platform differences (iOS vs Android behavior)
6. Accessibility (screen reader, touch targets, contrast)
7. Offline behavior (cached data, retry logic)

Sort by priority: Critical bugs → Major issues → Minor issues
```

### QFIGMA
When I type "qfigma", this means:
```
1. Verify Figma MCP connection with /mcp
2. Confirm Figma desktop is open with Dev Mode enabled (Shift+D)
3. Ask user to select the frame/component in Figma OR provide a link
4. Read the selected design from local MCP server
5. Extract design tokens, layout, spacing, and colors
6. Implement matching existing project patterns and theme
7. Review against Figma for pixel accuracy
8. Note any deviations and explain why
```

### QGIT
When I type "qgit", this means:
```
Add all changes to staging, create a commit, and push to remote.

Concise commit message format (Conventional Commits):
<type>: <description>

Types: Feat, Fix, Refactor, Test, Docs, Style, Chore

Examples:
- Feat: add Pokemon detail screen with stats tabs
- Fix: resolve infinite scroll not loading more items
- Refactor: extract Pokemon card to reusable component
- Test: add unit tests for favorites hook

Split changes into multiple commits if they cover different concerns.

MUST NOT mention Claude or Anthropic in commit messages.
```

## Project Context

**Tech Stack:** Expo 54 + React Native 0.83 + React 19 + TypeScript (strict)
**Routing:** Expo Router (file-based in `/app`)
**State:** TanStack Query (API) + SQLite (persistence)
**Styling:** StyleSheet API + theme constants
**Animations:** react-native-reanimated

**Assignment:** See `REQUIREMENTS.md` for full Pokedex assignment requirements.
**Design:** [Figma Prototype](https://www.figma.com/design/dsgGXcu5WELIvRW90m5308/Pok%C3%A9mon-Code-Challenge)

### Project Structure
```
app/                    # Expo Router file-based routing
├── _layout.tsx         # Root layout with providers
├── (tabs)/             # Tab navigation group
│   ├── _layout.tsx     # Tab bar config
│   └── *.tsx           # Tab screens
components/             # Reusable UI
├── themed-*.tsx        # Theme-aware components
└── ui/                 # Primitives (icons, collapsible)
hooks/                  # Custom hooks
constants/theme.ts      # Colors and fonts
```

## React Native Best Practices

### Component Patterns
- Use functional components with hooks exclusively
- Structure files: exported component > subcomponents > helpers > types
- Use descriptive names with auxiliary verbs: `isLoading`, `hasError`, `canSubmit`
- Prefer iteration and modularization over duplication

### Type Safety (REQUIRED)
- Zero `any` types allowed
- No type casting or `@ts-ignore`
- Use interfaces over types
- Use Zod for runtime validation at API boundaries

### State Management
- TanStack Query for all API calls (caching, loading states, error handling)
- SQLite for persistent local storage (favorites)
- React Context + useReducer for global UI state only
- Avoid prop drilling beyond 2 levels

### Performance
- FlatList: use `keyExtractor`, `getItemLayout`, `removeClippedSubviews`
- Avoid anonymous functions in `renderItem` and event handlers
- Use `useCallback` and `useMemo` for expensive operations
- Implement pagination with infinite scroll (50 items per load)

### Error Handling
- Every async operation needs loading AND error states
- Use error boundaries for component-level failures
- Log errors with Sentry or equivalent (no console.log in production)

### Accessibility
- All interactive elements need `accessibilityLabel`
- Support screen readers with proper roles
- Ensure touch targets are minimum 44x44 points

## Figma MCP Workflow (Local Desktop Server)

### Setup Requirements
1. Figma desktop app must be running
2. Open a Design file and toggle to Dev Mode (Shift+D)
3. In the Inspect panel, click "Enable desktop MCP server"
4. Server runs at `http://127.0.0.1:3845/mcp`

### Verification
Run `/mcp` to check connection. If disconnected:
```bash
claude mcp add figma-desktop http://127.0.0.1:3845/mcp
```
Ensure Figma desktop is open with Dev Mode enabled.

### Design Implementation Flow
**Selection-based (recommended):**
1. Select a frame/component directly in Figma
2. Ask Claude to implement the selected element
3. Claude reads the current selection automatically

### Best Results
- Use semantic layer names in Figma (not "Frame 427")
- Keep components on dedicated pages
- Avoid deep nesting in frames/groups
- Select specific components, not entire pages
- Implement one component at a time for complex flows

### Limitations
- Figma desktop must stay open during session
- Large selections may timeout - select smaller sections
- Multi-frame flows require manual combination
- Code updates often need manual refinement

## Senior Engineer Code Quality

### Before Writing Code
- ALWAYS read existing code in the area you're modifying
- Understand existing patterns and conventions
- Ask clarifying questions when requirements are ambiguous
- Never assume - validate understanding first

### During Implementation
- Write self-documenting code (clear names > comments)
- Handle all edge cases and error states
- Consider accessibility from the start
- Follow existing file/folder conventions
- One responsibility per component/function

### After Implementation
- Self-review: Would a senior approve this in code review?
- Zero TypeScript errors
- Zero ESLint warnings
- Zero console.log statements
- Loading and error states tested

### Code Review Mindset
- Question assumptions about requirements
- Validate edge cases: empty states, error states, loading states
- Check for security issues: input sanitization, secure storage
- Ensure performance: no unnecessary re-renders, optimized lists

## Project-Specific Patterns

### Theming
```tsx
// Use themed components for automatic light/dark mode
import { ThemedText, ThemedView } from '@/components/themed';

// Override with props when needed
<ThemedText lightColor="#000" darkColor="#fff">Text</ThemedText>

// Access theme colors directly
const color = useThemeColor({}, 'text');
```

### Platform Variants
Create platform-specific files with extensions:
- `Component.ios.tsx` - iOS-specific
- `Component.android.tsx` - Android-specific
- `Component.web.tsx` - Web-specific
- `Component.tsx` - Default fallback

### Imports
Use the `@/*` path alias for all project imports:
```tsx
import { ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
```

## Configuration Notes

- **New Architecture:** Enabled (`newArchEnabled: true`)
- **React Compiler:** Experimental (enabled)
- **Typed Routes:** Type-safe routing via `typedRoutes` experiment
