import { describe, it, expect } from 'vitest'

const API_URL = process.env.API_URL || 'http://localhost:5000'

describe('Auth API Tests', () => {
  describe('GET /api/me', () => {
    it('should return 200 with mock auth (no token required in dev)', async () => {
      const response = await fetch(`${API_URL}/api/me`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
    })
  })

  describe('GET /api/sessions', () => {
    it('should return 200 (public route)', async () => {
      const response = await fetch(`${API_URL}/api/sessions`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  describe('Rate Limiting', () => {
    it('should return 429 after too many requests', async () => {
      const requests = Array(65).fill(null).map(() => 
        fetch(`${API_URL}/api/sessions`)
      )
      
      const responses = await Promise.all(requests)
      const statusCodes = responses.map(r => r.status)
      
      expect(statusCodes.some(code => code === 429)).toBe(true)
    })
  })

  describe('Health Check', () => {
    it('should return 200 on /health', async () => {
      const response = await fetch(`${API_URL}/health`)
      expect(response.status).toBe(200)
    })
  })
})
