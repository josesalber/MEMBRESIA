import { User } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Panel Administrativo</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <User size={20} className="text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Administrador</p>
        </div>
      </div>
    </header>
  );
}
