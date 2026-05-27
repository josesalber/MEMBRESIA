import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, Save, RefreshCcw } from 'lucide-react';
import {
  institucionesService,
  UpdateInstitucionDTO,
  RenovarInstitucionDTO,
  TIPOS_INSTITUCION,
  tipoInstitucionLabel,
} from '../services/instituciones.service';
import { Loader } from '../components/Loader';
import { useEffect } from 'react';
import { getApiErrorMessage } from '../lib/apiError';
import { licenciaService } from '../services/licencia.service';

const institucionSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  tipo: z.enum(['COLEGIO', 'INSTITUTO', 'ACADEMIA'] as const),
  emailContacto: z.string().email('Email inválido'),
  subdominio: z.string().min(3, 'El subdominio debe tener al menos 3 caracteres'),
  backendUrl: z.string().url('URL inválida'),
  fechaVencimiento: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
});

type InstitucionForm = z.infer<typeof institucionSchema>;

export function EditarInstitucion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: institucion, isLoading } = useQuery({
    queryKey: ['institucion', id],
    queryFn: () => institucionesService.getById(id!),
    enabled: !!id,
  });

  const { data: validacionLicencia } = useQuery({
    queryKey: ['licencia', id],
    queryFn: () => licenciaService.validarPorId(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<InstitucionForm>({
    resolver: zodResolver(institucionSchema),
  });

  useEffect(() => {
    if (institucion) {
      reset({
        nombre: institucion.nombre,
        tipo: institucion.tipo,
        emailContacto: institucion.emailContacto,
        subdominio: institucion.subdominio,
        backendUrl: institucion.backendUrl,
        fechaVencimiento: institucion.fechaVencimiento.split('T')[0],
      });
    }
  }, [institucion, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateInstitucionDTO) => institucionesService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] });
      queryClient.invalidateQueries({ queryKey: ['institucion', id] });
      toast.success('Cambios guardados');
      navigate('/instituciones');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudieron guardar los cambios'));
    },
  });

  const renovarMutation = useMutation({
    mutationFn: (data: RenovarInstitucionDTO) => institucionesService.renovar(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] });
      queryClient.invalidateQueries({ queryKey: ['institucion', id] });
      toast.success('Licencia renovada');
      navigate('/instituciones');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo renovar la licencia'));
    },
  });

  const handleRenew = () => {
    renovarMutation.mutate({
      fechaVencimiento: getValues('fechaVencimiento'),
    });
  };

  const isVencida = institucion?.estado === 'VENCIDO';

  const tipoOptions = TIPOS_INSTITUCION.map((tipo) => ({
    value: tipo,
    label: tipoInstitucionLabel[tipo],
  }));

  const onSubmit = (data: InstitucionForm) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/instituciones')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Institución</h1>
          <p className="text-gray-600">Actualiza la información de {institucion?.nombre}</p>
        </div>
      </div>

      {institucion && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Estado</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{institucion.estado}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Licencia</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {validacionLicencia ? (validacionLicencia.valida ? 'Válida' : `Inválida · ${validacionLicencia.motivo}`) : 'Sin validar'}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">API Key</p>
            <p className="mt-1 break-all text-sm font-semibold text-gray-900">{institucion.apiKey}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Creación</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {new Date(institucion.fechaCreacion).toLocaleString('es-ES')}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Institución
            </label>
            <input
              {...register('nombre')}
              type="text"
              placeholder="Ej: Colegio San José"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              {...register('tipo')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Selecciona un tipo</option>
              {tipoOptions.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Contacto
            </label>
            <input
              {...register('emailContacto')}
              type="email"
              placeholder="contacto@institucion.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            {errors.emailContacto && (
              <p className="text-red-500 text-sm mt-1">{errors.emailContacto.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subdominio</label>
            <input
              {...register('subdominio')}
              type="text"
              placeholder="institucion"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            {errors.subdominio && (
              <p className="text-red-500 text-sm mt-1">{errors.subdominio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Backend URL</label>
            <input
              {...register('backendUrl')}
              type="url"
              placeholder="https://api.institucion.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            {errors.backendUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.backendUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Vencimiento
            </label>
            <input
              {...register('fechaVencimiento')}
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            {errors.fechaVencimiento && (
              <p className="text-red-500 text-sm mt-1">{errors.fechaVencimiento.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/instituciones')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {isVencida && (
            <button
              type="button"
              onClick={handleRenew}
              disabled={renovarMutation.isPending}
              className="flex-1 px-6 py-3 border border-orange-200 bg-orange-50 text-orange-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RefreshCcw size={20} />
              {renovarMutation.isPending ? 'Renovando...' : 'Renovar licencia'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
