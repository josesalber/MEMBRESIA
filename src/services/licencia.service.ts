import axios from '../lib/axios';
import { EstadoInstitucion } from './instituciones.service';

export interface ValidacionLicenciaResponse {
  valida: boolean;
  motivo: 'SUSPENDIDO' | 'VENCIDO' | 'NO_EXISTE' | null;
  id: number | null;
  nombre: string | null;
  estado: EstadoInstitucion | null;
  apiKey: string | null;
  backendUrl: string | null;
}

export const licenciaService = {
  validarPorApiKey: async (apiKey: string): Promise<ValidacionLicenciaResponse> => {
    const response = await axios.get<ValidacionLicenciaResponse>(`/api/licencia/validar/${apiKey}`);
    return response.data;
  },

  validarPorId: async (institutionId: number | string): Promise<ValidacionLicenciaResponse> => {
    const response = await axios.get<ValidacionLicenciaResponse>(
      `/api/licencia/validar/id/${institutionId}`
    );
    return response.data;
  },
};