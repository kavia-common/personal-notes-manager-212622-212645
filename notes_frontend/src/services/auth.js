/**
 * PUBLIC_INTERFACE
 * saveAuth - Save token (and optional user) to storage
 */
export function saveAuth(token, user) {
  localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
}

/**
 * PUBLIC_INTERFACE
 * getToken - Get auth token
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * PUBLIC_INTERFACE
 * clearAuth - Clear token and user
 */
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
