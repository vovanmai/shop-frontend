import api from '@/api/axiosClient';

export function getUsers(params: object) {
  return api.get('api/users', { params: params});
}

export function getUser(id: number) {
  return api.get(`api/users/${id}`);
}

export function createUser(data: object) {
  return api.post('api/users', data);
}

export function updateUser(id: number, data: object) {
  return api.put(`api/users/${id}`, data);
}

export function deleteUser(id: number) {
  return api.delete(`api/users/${id}`);
}