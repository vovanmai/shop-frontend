import api from '@/api/axiosClient';

export function getAll(params: object = {}) {
  return api.get('api/permissions', { params: params});
}

