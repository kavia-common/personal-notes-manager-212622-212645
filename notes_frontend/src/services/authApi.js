import { apiFetch } from './api';

/**
 * PUBLIC_INTERFACE
 * login - Calls /auth/login with email and password
 */
export async function login({ email, password }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
}

/**
 * PUBLIC_INTERFACE
 * register - Calls /auth/register with email and password
 */
export async function register({ email, password }) {
  return apiFetch('/auth/register', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
}
