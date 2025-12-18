import { apiClient } from './apiClient';

// Simple test function to verify API connectivity
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');

    // Test health check
    const health = await apiClient.healthCheck();
    console.log('✅ Health check passed:', health);

    // Test sessions list (no auth required)
    const { count } = await apiClient.sessions.list();
    console.log(`✅ Sessions list passed: ${count} sessions found`);

    return {
      success: true,
      health,
      sessionsCount: count,
    };
  } catch (error) {
    console.error('❌ API test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Test with authentication
export const testApiWithAuth = async (token: string) => {
  try {
    console.log('Testing API with authentication...');

    // Set auth token
    const { setAuthToken } = await import('./apiClient');
    setAuthToken(token);

    // Test authenticated endpoint
    const user = await apiClient.user.getMe();
    console.log('✅ Authenticated user fetch passed:', user);

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('❌ Authenticated API test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
