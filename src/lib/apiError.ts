import axios from 'axios';

type ApiErrorPayload = Record<string, unknown> & {
  message?: unknown;
  error?: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const status = error.response?.status;
  const data = error.response?.data as ApiErrorPayload | string | undefined;

  if (status === 401) {
    return 'Sesión expirada. Inicia sesión otra vez.';
  }

  if (status === 403) {
    return 'Sin permiso para realizar acción.';
  }

  if (status === 404) {
    return 'Recurso no encontrado.';
  }

  if (status === 409) {
    return 'Subdominio duplicado.';
  }

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (isPlainObject(data)) {
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }

    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error;
    }

    const fieldMessage = Object.values(data).find((value) => typeof value === 'string' && value.trim());
    if (typeof fieldMessage === 'string') {
      return fieldMessage;
    }
  }

  return fallback;
}