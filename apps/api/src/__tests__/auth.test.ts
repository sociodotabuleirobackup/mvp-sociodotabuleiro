import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const API_URL = process.env.API_URL || 'http://localhost:5000'

describe('Auth API Tests', () => {
  describe('GET /api/me', () => {
    it('should return 401 without token', async () => {
      const response = await fetch(`${API_URL}/api/me`)
      expect(response.status).toBe(401)
      
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })

    it('should return 401 with invalid token', async () => {
      const response = await fetch(`${API_URL}/api/me`, {
        headers: {
          Authorization: 'Bearer invalid_token_here'
        }
      })
      expect(response.status).toBe(401)
      
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.code).toBe('AUTHENTICATION_FAILED')
    })

    it('should return 401 with malformed auth header', async () => {
      const response = await fetch(`${API_URL}/api/me`, {
        headers: {
          Authorization: 'Basic dXNlcjpwYXNz'
        }
      })
      expect(response.status).toBe(401)
      
      const data = await response.json()
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/sessions', () => {
    it('should return 401 without token', async () => {
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Session',
          description: 'Test',
          system: 'D&D 5e',
          playersMax: 4,
          price: 50,
          date: new Date().toISOString()
        })
      })
      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/sessions', () => {
    it('should return 200 without auth (public route)', async () => {
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
})
