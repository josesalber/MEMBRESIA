import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: 'green' | 'red' | 'yellow' | 'orange';
}

const colorClasses = {
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  orange: 'bg-orange-100 text-orange-600',
};

export function StatCard({ title, value, icon: Icon, color = 'orange' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}
