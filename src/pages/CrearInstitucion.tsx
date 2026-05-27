import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import {
  institucionesService,
  CreateInstitucionDTO,
  TIPOS_INSTITUCION,
  tipoInstitucionLabel,
  TipoInstitucion,
} from '../services/instituciones.service';
import { getApiErrorMessage } from '../lib/apiError';

const institucionSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  tipo: z.enum(['COLEGIO', 'INSTITUTO', 'ACADEMIA'] as const),
  emailContacto: z.string().email('Email inválido'),
  subdominio: z.string().min(3, 'El subdominio debe tener al menos 3 caracteres'),
  backendUrl: z.string().url('URL inválida'),
  fechaVencimiento: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
});

type InstitucionForm = z.infer<typeof institucionSchema>;

export function CrearInstitucion() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstitucionForm>({
    resolver: zodResolver(institucionSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInstitucionDTO) => institucionesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instituciones'] });
      toast.success('Institución creada correctamente');
      navigate('/instituciones');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo registrar la institución'));
    },
  });

  const onSubmit = (data: InstitucionForm) => {
    createMutation.mutate(data);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Institución</h1>
          <p className="text-gray-600">Registra una nueva institución en el sistema</p>
        </div>
      </div>

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
              {TIPOS_INSTITUCION.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipoInstitucionLabel[tipo]}
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

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/instituciones')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {createMutation.isPending ? 'Guardando...' : 'Crear Institución'}
          </button>
        </div>
      </form>
    </div>
  );
}
