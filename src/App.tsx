import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">Mini Twitter</h1>
        <p className="text-gray-600">Clean Architecture + MVVM Setup</p>
      </div>
    </QueryClientProvider>
  );
}
