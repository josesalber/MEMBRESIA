import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Search, Edit, Power, Ban, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  institucionesService,
  Institucion,
  tipoInstitucionLabel,
} from '../services/instituciones.service';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { getApiErrorMessage } from '../lib/apiError';

export function Instituciones() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'activate' | 'suspend' | null;
    institucion: Institucion | null;
  }>({ isOpen: false, type: null, institucion: null });

  const { data: instituciones, isLoading } = useQuery({
    queryKey: ['instituciones'],
    queryFn: institucionesService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: institucionesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] });
      toast.success('Institución eliminada');
      closeModal();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo eliminar la institución'));
    },
  });

  const activarMutation = useMutation({
    mutationFn: institucionesService.activar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] });
      toast.success('Institución activada');
      closeModal();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo activar la institución'));
    },
  });

  const suspenderMutation = useMutation({
    mutationFn: institucionesService.suspender,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] });
      toast.success('Institución suspendida');
      closeModal();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo suspender la institución'));
    },
  });

  const closeModal = () => {
    setConfirmModal({ isOpen: false, type: null, institucion: null });
  };

  const handleConfirm = () => {
    if (!confirmModal.institucion) return;

    switch (confirmModal.type) {
      case 'delete':
        deleteMutation.mutate(confirmModal.institucion.id);
        break;
      case 'activate':
        activarMutation.mutate(confirmModal.institucion.id);
        break;
      case 'suspend':
        suspenderMutation.mutate(confirmModal.institucion.id);
        break;
    }
  };

  const filteredInstituciones = instituciones?.filter(
    (inst) =>
      inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.subdominio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instituciones</h1>
          <p className="text-gray-600">Gestiona todas las instituciones registradas</p>
        </div>
        <button
          onClick={() => navigate('/instituciones/crear')}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors"
        >
          Nueva Institución
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar institución..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {!filteredInstituciones || filteredInstituciones.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={searchTerm ? 'No se encontraron resultados' : 'No hay instituciones'}
            description={
              searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primera institución'
            }
            action={
              !searchTerm
                ? {
                    label: 'Crear Institución',
                    onClick: () => navigate('/instituciones/crear'),
                  }
                : undefined
            }
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
                    Subdominio
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Vencimiento
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInstituciones.map((institucion) => (
                  <tr key={institucion.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {institucion.nombre}
                    </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {tipoInstitucionLabel[institucion.tipo]}
                      </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{institucion.subdominio}</td>
                    <td className="px-6 py-4">
                      <StatusBadge estado={institucion.estado} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(institucion.fechaVencimiento)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/instituciones/${institucion.id}/editar`)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        {institucion.estado !== 'ACTIVO' && (
                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                type: 'activate',
                                institucion,
                              })
                            }
                            className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                            title="Activar"
                          >
                            <Power size={18} />
                          </button>
                        )}
                        {institucion.estado === 'ACTIVO' && (
                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                type: 'suspend',
                                institucion,
                              })
                            }
                            className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                            title="Suspender"
                          >
                            <Ban size={18} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              type: 'delete',
                              institucion,
                            })
                          }
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={
          confirmModal.type === 'delete'
            ? 'Eliminar Institución'
            : confirmModal.type === 'activate'
            ? 'Activar Institución'
            : 'Suspender Institución'
        }
        message={
          confirmModal.type === 'delete'
            ? `¿Estás seguro de eliminar "${confirmModal.institucion?.nombre}"? Esta acción no se puede deshacer.`
            : confirmModal.type === 'activate'
            ? `¿Confirmas que deseas activar "${confirmModal.institucion?.nombre}"?`
            : `¿Confirmas que deseas suspender "${confirmModal.institucion?.nombre}"?`
        }
        confirmText={
          confirmModal.type === 'delete'
            ? 'Eliminar'
            : confirmModal.type === 'activate'
            ? 'Activar'
            : 'Suspender'
        }
        variant={
          confirmModal.type === 'delete'
            ? 'danger'
            : confirmModal.type === 'suspend'
            ? 'warning'
            : 'info'
        }
      />
    </div>
  );
}
