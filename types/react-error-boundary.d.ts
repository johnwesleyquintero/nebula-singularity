declare module 'react-error-boundary' {
  import * as React from 'react';

  interface ErrorBoundaryProps {
    FallbackComponent: React.ComponentType<{ error: Error }>;
    onError?: (error: Error, info: { componentStack: string }) => void;
    children?: React.ReactNode;
  }

  export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {}

  export function useErrorHandler(givenError?: unknown): (error: unknown) => void;
}
