import { useQuery } from '@tanstack/react-query';
import { Building2, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import {
  institucionesService,
  Institucion,
  tipoInstitucionLabel,
} from '../services/instituciones.service';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: instituciones, isLoading } = useQuery({
    queryKey: ['instituciones'],
    queryFn: institucionesService.getAll,
  });

  if (isLoading) {
    return <Loader />;
  }

  const activas = instituciones?.filter((i) => i.estado === 'ACTIVO').length || 0;
  const suspendidas = instituciones?.filter((i) => i.estado === 'SUSPENDIDO').length || 0;
  const vencidas = instituciones?.filter((i) => i.estado === 'VENCIDO').length || 0;
  const total = instituciones?.length || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general de instituciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Instituciones" value={total} icon={TrendingUp} color="orange" />
        <StatCard title="Instituciones Activas" value={activas} icon={Building2} color="green" />
        <StatCard title="Suspendidas" value={suspendidas} icon={AlertCircle} color="red" />
        <StatCard title="Vencidas" value={vencidas} icon={Clock} color="yellow" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Instituciones Recientes</h2>
        </div>

        {!instituciones || instituciones.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No hay instituciones"
            description="Comienza creando tu primera institución"
            action={{
              label: 'Crear Institución',
              onClick: () => navigate('/instituciones/crear'),
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Vencimiento
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {instituciones.slice(0, 10).map((institucion: Institucion) => (
                  <tr key={institucion.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {institucion.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {tipoInstitucionLabel[institucion.tipo]}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge estado={institucion.estado} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(institucion.fechaVencimiento)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
