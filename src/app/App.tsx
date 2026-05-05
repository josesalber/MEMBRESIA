import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '../store/AuthContext';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}