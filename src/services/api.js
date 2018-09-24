import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTodos(params) {
  return request(`/api/todos?${stringify(params)}`);
}

export async function queryTodo(params) {
  return request(`/api/todo?${stringify(params)}`);
}

export async function removeTodo(id) {
  return request(`/api/todo/${id}`, {
    method: 'DELETE',
  });
}

export async function addTodo(params) {
  return request('/api/todo', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateTodo(params) {
  return request('/api/todo', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function toggleTodo(id) {
  return request(`/api/todo/${id}/toggle`);
}

export async function archiveTodo(id) {
  return request(`/api/todo/${id}/archive`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
