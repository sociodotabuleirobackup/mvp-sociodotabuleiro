const API_BASE_URL = '';

type GetAccessTokenFn = () => Promise<string>;

let getAccessToken: GetAccessTokenFn | null = null;
let loginRedirect: (() => void) | null = null;

export const setAuthFunctions = (
  tokenFn: GetAccessTokenFn, 
  loginFn: () => void
) => {
  getAccessToken = tokenFn;
  loginRedirect = loginFn;
};

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchWithAuth<T>(
  endpoint: string, 
  options: ApiOptions = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  const { 
    method = 'GET', 
    body, 
    headers = {},
    requiresAuth = true 
  } = options;

  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requiresAuth && getAccessToken) {
    try {
      const token = await getAccessToken();
      fetchHeaders['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to get access token:', error);
      if (loginRedirect) {
        loginRedirect();
      }
      return { success: false, error: 'Authentication required' };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: fetchHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && retryCount === 0 && getAccessToken) {
      console.warn('Got 401, retrying with fresh token...');
      return fetchWithAuth<T>(endpoint, options, 1);
    }

    if (response.status === 401 && loginRedirect) {
      console.error('Authentication failed after retry');
      loginRedirect();
      return { success: false, error: 'Authentication failed' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Request failed' 
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'PATCH', body }),
};

export const apiPublic = {
  get: <T>(endpoint: string) => 
    fetchWithAuth<T>(endpoint, { method: 'GET', requiresAuth: false }),
    
  post: <T>(endpoint: string, body?: unknown) => 
    fetchWithAuth<T>(endpoint, { method: 'POST', body, requiresAuth: false }),
};
