# Pokédex App

A modern React application that lets users explore Pokémon using the PokéAPI with a polished user experience and production-ready features.

## Features

- **Search & Filter**
  - Global search with debouncing (300ms)
  - Common Sorting for both Tabs Data taking care of infinite scroll enable/disable
  - Filter by Pokémon type (18 different types)
  - Filter by favorites
  - Combine filters for advanced search
  - Clean and responsive UI

- **List & Detail Views**
  - Grid/List layout with Pokémon cards
  - Detailed view with stats and abilities
  - High-quality official artwork

- **Infinite Scroll**
  - Smooth scrolling experience
  - Progressive loading
  - Loading states and error handling

- **Favorites System**
  - Add/remove favorites
  - Persisted in localStorage
  - Dedicated favorites view
  - Bulk management

- **Performance Optimizations**
  - Request debouncing
  - React Query for caching
  - Virtualized lists for large datasets
  - Optimized image loading

## Technologies Used

- **Core**
  - React + TypeScript
  - Vite for blazing fast builds
  - Material-UI for component library

- **State Management & Data Fetching**
  - React Query for server state
  - React Context for global UI state
  - Axios for API requests

- **Testing**
  - Jest for unit testing
  - React Testing Library for component tests

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
src/
  ├── components/       # Reusable UI components
  ├── hooks/           # Custom React hooks
  ├── services/        # API and external services
  ├── types/           # TypeScript interfaces
  ├── context/         # React Context providers
  └── __tests__/       # Test files
```

## Design Decisions

- **React Query**: Chosen for its powerful caching, prefetching, and background updates capabilities
- **Material-UI**: Provides a consistent design system and responsive components
- **Context API**: Used for favorites management as the state is simple and globally needed
- **TypeScript**: Ensures type safety and better developer experience
- **Vite**: Offers superior build performance and development experience

## API

This project uses the [PokéAPI](https://pokeapi.co/) which provides comprehensive data about Pokémon. We utilize the following endpoints:

- `/pokemon`: List and search Pokémon
- `/pokemon/{id}`: Get detailed information about a specific Pokémon

## Testing Strategy

- **Unit Tests**: For utilities and hooks
- **Component Tests**: Using React Testing Library for user-centric testing
- **Integration Tests**: Key user flows like search and favorites

## Future Improvements

- Add filtering by Pokémon type
- Implement sorting by various attributes
- Add PWA support for offline access
- Implement data prefetching for smoother navigation
- Add comparison feature between Pokémon

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

