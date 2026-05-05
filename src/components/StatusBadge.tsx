import { EstadoInstitucion } from '../services/instituciones.service';

interface StatusBadgeProps {
  estado: EstadoInstitucion;
}

const estadoConfig = {
  ACTIVO: {
    label: 'Activo',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  SUSPENDIDO: {
    label: 'Suspendido',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  VENCIDO: {
    label: 'Vencido',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
};

export function StatusBadge({ estado }: StatusBadgeProps) {
  const config = estadoConfig[estado];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
