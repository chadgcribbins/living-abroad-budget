# Architecture Overview

This document provides a high-level overview of the Living Abroad Budget application architecture.

## Core Technologies

- **Frontend Framework**: Next.js 14 with React
- **Styling**: TailwindCSS with DaisyUI components
- **State Management**: Zustand with slices and persistent storage
- **Type Safety**: TypeScript for all components and state
- **API Integration**: Next.js API routes and external API connections

## Key Architectural Decisions

### Local-First Approach

The application follows a local-first philosophy:
- Data is stored primarily in the browser using localStorage
- The state is persisted between sessions
- Users can export and import scenarios as JSON files
- Cloud synchronization is optional (future enhancement)

### State Management

We use Zustand for state management with a sliced approach:
- Each domain has its own slice (income, housing, education, etc.)
- The store is persisted with middleware
- Careful attention to what gets persisted vs. derived values
- Type-safe actions and state

### Component Architecture

The UI is built with a component-based architecture:
- Shared UI components (buttons, inputs, selectors)
- Domain-specific components
- Layout components for page structure
- Chart components for data visualization

### API Strategy

External integrations follow these principles:
- Minimal API dependencies for core functionality
- Rate limiting protection
- Proper error handling and fallbacks
- Cache responses where appropriate

## Architectural Diagrams

Future enhancements to this document will include:
- Data flow diagrams
- Component hierarchy visualization
- State management flow

## Future Architecture Evolution

As the application grows, we plan to:
- Evaluate serverless functions for API routes
- Consider database integration for cloud storage
- Implement authentication and multi-user support
- Enhance offline capabilities 