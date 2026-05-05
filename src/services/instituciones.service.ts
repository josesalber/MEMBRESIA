import axios from '../lib/axios';

export type EstadoInstitucion = 'ACTIVO' | 'SUSPENDIDO' | 'VENCIDO';
export type TipoInstitucion = 'Colegio' | 'Instituto' | 'Academia';

export interface Institucion {
  id: string;
  nombre: string;
  tipo: TipoInstitucion;
  emailContacto: string;
  subdominio: string;
  backendUrl: string;
  estado: EstadoInstitucion;
  fechaVencimiento: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInstitucionDTO {
  nombre: string;
  tipo: TipoInstitucion;
  emailContacto: string;
  subdominio: string;
  backendUrl: string;
  fechaVencimiento: string;
}

export interface UpdateInstitucionDTO extends Partial<CreateInstitucionDTO> {}

export const institucionesService = {
  getAll: async (): Promise<Institucion[]> => {
    const response = await axios.get<Institucion[]>('/api/instituciones');
    return response.data;
  },

  getById: async (id: string): Promise<Institucion> => {
    const response = await axios.get<Institucion>(`/api/instituciones/${id}`);
    return response.data;
  },

  create: async (data: CreateInstitucionDTO): Promise<Institucion> => {
    const response = await axios.post<Institucion>('/api/instituciones', data);
    return response.data;
  },

  update: async (id: string, data: UpdateInstitucionDTO): Promise<Institucion> => {
    const response = await axios.put<Institucion>(`/api/instituciones/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/instituciones/${id}`);
  },

  activar: async (id: string): Promise<Institucion> => {
    const response = await axios.patch<Institucion>(`/api/instituciones/${id}/activar`);
    return response.data;
  },

  suspender: async (id: string): Promise<Institucion> => {
    const response = await axios.patch<Institucion>(`/api/instituciones/${id}/suspender`);
    return response.data;
  },

  renovar: async (id: string): Promise<Institucion> => {
    const response = await axios.patch<Institucion>(`/api/instituciones/${id}/renovar`);
    return response.data;
  },
};
