export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * PUBLIC_INTERFACE
 * apiFetch - Fetch wrapper that prefixes base URL and attaches Bearer token.
 */
export async function apiFetch(path, { method = 'GET', headers = {}, body, auth = true } = {}) {
  const token = auth ? localStorage.getItem('token') : null;
  const url = `${API_BASE_URL}${path}`;

  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (auth && token) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = (isJson && data && (data.detail || data.message)) || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
