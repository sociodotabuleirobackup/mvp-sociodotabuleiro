import { User, Session, Booking } from '@socio-do-tabuleiro/shared';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  details?: any[];
}

interface ApiListResponse<T> extends ApiResponse<T[]> {
  count: number;
}

// Error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Auth token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

// Base fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || `HTTP ${response.status}`,
        response.status,
        data.details
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or parsing errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// API Client
export const apiClient = {
  // Health check
  async healthCheck() {
    return apiRequest<{ status: string; database: string }>('/healthz');
  },

  // User endpoints
  user: {
    async getMe(): Promise<User> {
      const response = await apiRequest<ApiResponse<User>>('/api/me');
      return response.data;
    },

    async updateMe(
      data: Partial<Pick<User, 'name' | 'avatarUrl'>>
    ): Promise<User> {
      const response = await apiRequest<ApiResponse<User>>('/api/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data;
    },

    async becomeMaster(bio: string): Promise<User> {
      const response = await apiRequest<ApiResponse<User>>(
        '/api/me/become-master',
        {
          method: 'POST',
          body: JSON.stringify({ bio }),
        }
      );
      return response.data;
    },
  },

  // Session endpoints
  sessions: {
    async list(filters?: {
      status?: string;
      locationType?: 'ONLINE' | 'VENUE';
      gameSystem?: string;
      masterId?: string;
      storeId?: string;
      minPrice?: number;
      maxPrice?: number;
      scheduledAfter?: string;
      scheduledBefore?: string;
    }): Promise<{ sessions: Session[]; count: number }> {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const endpoint = `/api/sessions${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest<ApiListResponse<Session>>(endpoint);
      return { sessions: response.data, count: response.count };
    },

    async getById(id: string): Promise<Session> {
      const response = await apiRequest<ApiResponse<Session>>(
        `/api/sessions/${id}`
      );
      return response.data;
    },

    async create(sessionData: {
      title: string;
      description?: string;
      gameSystem: string;
      maxPlayers: number;
      price: number;
      duration: number;
      scheduledAt: string;
      locationType: 'ONLINE' | 'VENUE';
      storeId?: string;
    }): Promise<Session> {
      const response = await apiRequest<ApiResponse<Session>>('/api/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
      return response.data;
    },

    async update(
      id: string,
      updates: Partial<{
        title: string;
        description: string;
        gameSystem: string;
        maxPlayers: number;
        price: number;
        duration: number;
        scheduledAt: string;
        locationType: 'ONLINE' | 'VENUE';
        storeId: string;
      }>
    ): Promise<Session> {
      const response = await apiRequest<ApiResponse<Session>>(
        `/api/sessions/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates),
        }
      );
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await apiRequest(`/api/sessions/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Booking endpoints
  bookings: {
    async getMy(): Promise<Booking[]> {
      const response =
        await apiRequest<ApiListResponse<Booking>>('/api/bookings/my');
      return response.data;
    },

    async create(sessionId: string): Promise<Booking> {
      const response = await apiRequest<ApiResponse<Booking>>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
      return response.data;
    },

    async confirm(id: string): Promise<Booking> {
      const response = await apiRequest<ApiResponse<Booking>>(
        `/api/bookings/${id}/confirm`,
        {
          method: 'PUT',
        }
      );
      return response.data;
    },

    async cancel(id: string): Promise<void> {
      await apiRequest(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

// Stripe Connect types
interface StripeConnectStatus {
  success: boolean;
  hasAccount: boolean;
  accountId?: string;
  verified?: boolean;
  status?: 'pending' | 'processing' | 'verified' | 'failed' | 'requires_action';
  requirements?: string[];
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

interface CreateConnectAccountResponse {
  success: boolean;
  accountId: string;
  onboardingUrl: string;
  message?: string;
}

interface StripeBalance {
  success: boolean;
  balance: {
    available: number;
    pending: number;
  };
  recentTransfers: Array<{
    id: string;
    amount: number;
    currency: string;
    created: string;
  }>;
}

interface SplitConfig {
  name: string;
  platformFee: number;
  destinationShare: number;
}

interface CreatePaymentResponse {
  success: boolean;
  sessionId: string;
  checkoutUrl: string;
  split: {
    total: number;
    platformFee: number;
    destinationAmount: number;
  };
}

// Utility function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.details && error.details.length > 0) {
      // Validation errors
      return error.details.map(d => d.message).join(', ');
    }
    return error.message;
  }

  return error instanceof Error ? error.message : 'Unknown error occurred';
};

// Stripe Connect API
export const stripeApi = {
  async getConnectStatus(): Promise<StripeConnectStatus> {
    return apiRequest<StripeConnectStatus>('/api/stripe/connect/status');
  },

  async createConnectAccount(data: {
    businessType: 'individual' | 'company';
    firstName?: string;
    lastName?: string;
    companyName?: string;
    cpf?: string;
    cnpj?: string;
  }): Promise<CreateConnectAccountResponse> {
    return apiRequest<CreateConnectAccountResponse>('/api/stripe/connect/create-account', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getRefreshOnboardingUrl(): Promise<{ success: boolean; url: string }> {
    return apiRequest<{ success: boolean; url: string }>('/api/stripe/connect/refresh-link');
  },

  async getDashboardUrl(): Promise<{ success: boolean; url: string }> {
    return apiRequest<{ success: boolean; url: string }>('/api/stripe/connect/dashboard');
  },

  async getBalance(): Promise<StripeBalance> {
    return apiRequest<StripeBalance>('/api/stripe/balance');
  },

  async getSplitConfigs(): Promise<{ success: boolean; configs: Record<string, SplitConfig> }> {
    return apiRequest<{ success: boolean; configs: Record<string, SplitConfig> }>('/api/stripe/split-configs');
  },

  async createPayment(data: {
    amount: number;
    transactionType: 'TABLE_RESERVATION' | 'RPG_SESSION' | 'FOOD_ORDER';
    destinationUserId: string;
    productName: string;
    productDescription?: string;
    bookingId?: string;
    foodOrderId?: string;
  }): Promise<CreatePaymentResponse> {
    return apiRequest<CreatePaymentResponse>('/api/stripe/create-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
