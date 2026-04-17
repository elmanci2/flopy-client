/**
 * Flopy API Client
 * Centralized fetch wrapper for the Flopy Backend
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100').replace(/\/$/, '')

async function request<T>(
  endpoint: string, 
  method: string = 'GET', 
  body?: any, 
  token?: string
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
       console.error('API Client: 401 Detectado. Limpiando sesión...')
       localStorage.removeItem('flopy_user')
       // Evitar bucles: solo redirigir si no estamos ya en login
       if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login?error=expired'
       }
    }
  }

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    data = { message: text }
  }

  if (!response.ok) {
    const error = new Error(data.message || `API Error: ${response.status}`)
    ;(error as any).status = response.status
    throw error
  }

  return data as T
}

export const flopyApi = {
  get: <T>(endpoint: string, token?: string) => request<T>(endpoint, 'GET', undefined, token),
  post: <T>(endpoint: string, body: any, token?: string) => request<T>(endpoint, 'POST', body, token),
  put: <T>(endpoint: string, body: any, token?: string) => request<T>(endpoint, 'PUT', body, token),
  delete: <T>(endpoint: string, token?: string) => request<T>(endpoint, 'DELETE', undefined, token),
  url: API_URL
}
