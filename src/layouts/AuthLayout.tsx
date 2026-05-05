import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col justify-center p-12">
          <h1 className="text-6xl font-bold text-orange-600 mb-4">KUI</h1>
          <p className="text-2xl text-gray-700 mb-2">Central</p>
          <p className="text-gray-600">
            Sistema de gestión integral para instituciones educativas
          </p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
