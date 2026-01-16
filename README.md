# Pokedex App

A React Native Pokedex application built with Expo, featuring a modern UI with dark mode support, infinite scrolling, and offline favorites persistence.

## Features

- **Pokemon List** - Browse Pokemon with search and type filtering
- **Pokemon Details** - View metadata, base stats, and evolution chains
- **Favorites** - Save favorite Pokemon with SQLite persistence
- **Type Badges** - Unique colors for each Pokemon type
- **Dark Mode** - Full light/dark theme support
- **Infinite Scroll** - Paginated loading (50 items per page)
- **Smooth Animations** - Powered by React Native Reanimated

## Tech Stack

- **Framework:** Expo 54 + React Native 0.81
- **Language:** TypeScript (strict mode)
- **UI:** React 19 + StyleSheet API
- **Routing:** Expo Router (file-based)
- **API State:** TanStack Query v5
- **Local Storage:** expo-sqlite
- **Animations:** react-native-reanimated

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Yarn package manager
- [Expo Go](https://expo.dev/go) app on iOS/Android, or an emulator

### Installation

```bash
yarn install
```

### Running the App

```bash
yarn start      # Start Expo dev server (choose platform from menu)
yarn ios        # Run on iOS Simulator
yarn android    # Run on Android Emulator
yarn web        # Run in web browser
```

### Development

```bash
yarn lint       # Run ESLint
```

## Project Structure

```
app/                    # Screens (Expo Router file-based routing)
├── _layout.tsx         # Root layout with providers
├── (tabs)/             # Tab navigation group
└── pokemon/            # Pokemon detail screens

components/             # Reusable UI components
├── themed-*.tsx        # Theme-aware components
├── pokemon/            # Pokemon-specific components
└── ui/                 # UI primitives

hooks/                  # Custom React hooks
lib/                    # API clients, database, providers
constants/              # Theme colors, design tokens
```

## Resources

- [REQUIREMENTS.md](./REQUIREMENTS.md) - Full assignment requirements
- [PokeAPI](https://pokeapi.co/) - Pokemon data source
- [Figma Design](https://www.figma.com/design/dsgGXcu5WELIvRW90m5308/Pok%C3%A9mon-Code-Challenge) - UI/UX prototype
