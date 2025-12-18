# API Examples

Exemplos de uso da API REST do Sócio do Tabuleiro.

## Base URL

```
http://localhost:3001
```

## Authentication

Todas as rotas protegidas requerem um token JWT no header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

#### GET /healthz

Verifica se a API está funcionando e conectada ao banco.

```bash
# curl
curl http://localhost:3001/healthz

# httpie
http GET http://localhost:3001/healthz
```

**Response:**

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-01-18T14:30:00.000Z",
  "database": "connected"
}
```

---

### User Routes

#### GET /api/me

Retorna o perfil do usuário autenticado.

```bash
# curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/me

# httpie
http GET http://localhost:3001/api/me \
  Authorization:"Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "mestre@sociodotabuleiro.com",
    "name": "Alex Dungeon Master",
    "avatar": "https://...",
    "role": "MASTER",
    "phone": "+5511999887766",
    "masterProfile": {
      "id": "master_123",
      "bio": "Mestre experiente...",
      "rating": 4.8,
      "totalGames": 156
    }
  }
}
```

#### PUT /api/me

Atualiza o perfil do usuário.

```bash
# curl
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Master",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+5511999887766"
  }' \
  http://localhost:3001/api/me

# httpie
http PUT http://localhost:3001/api/me \
  Authorization:"Bearer YOUR_TOKEN" \
  name="Alex Master" \
  avatar="https://example.com/avatar.jpg" \
  phone="+5511999887766"
```

#### POST /api/me/become-master

Transforma um usuário em mestre.

```bash
# curl
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Mestre experiente com 10 anos de experiência"
  }' \
  http://localhost:3001/api/me/become-master

# httpie
http POST http://localhost:3001/api/me/become-master \
  Authorization:"Bearer YOUR_TOKEN" \
  bio="Mestre experiente com 10 anos de experiência"
```

---

### Session Routes

#### GET /api/sessions

Lista sessões com filtros opcionais.

```bash
# Listar todas as sessões abertas
curl http://localhost:3001/api/sessions

# Com filtros
curl "http://localhost:3001/api/sessions?gameSystem=D%26D&minPrice=30&maxPrice=50"

# httpie
http GET http://localhost:3001/api/sessions \
  gameSystem=="D&D 5e" \
  minPrice==30 \
  maxPrice==50 \
  locationType==VENUE
```

**Query Parameters:**

- `status`: OPEN | FULL | CANCELLED | COMPLETED
- `locationType`: ONLINE | VENUE
- `gameSystem`: string (partial match)
- `masterId`: string
- `storeId`: string
- `minPrice`: number
- `maxPrice`: number
- `scheduledAfter`: ISO datetime
- `scheduledBefore`: ISO datetime

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "session_123",
      "title": "A Maldição de Strahd - Capítulo 1",
      "description": "Uma aventura sombria...",
      "gameSystem": "D&D 5e",
      "maxPlayers": 5,
      "price": 45.0,
      "duration": 240,
      "status": "OPEN",
      "locationType": "VENUE",
      "scheduledAt": "2025-01-25T14:00:00.000Z",
      "master": {
        "id": "master_123",
        "user": {
          "name": "Alex Dungeon Master",
          "avatar": "https://..."
        }
      },
      "venue": {
        "name": "Caverna do Dragão",
        "address": "Rua dos Aventureiros, 123"
      },
      "_count": {
        "bookings": 2
      }
    }
  ],
  "count": 1
}
```

#### GET /api/sessions/:id

Detalhes de uma sessão específica.

```bash
# curl
curl http://localhost:3001/api/sessions/session_123

# httpie
http GET http://localhost:3001/api/sessions/session_123
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "session_123",
    "title": "A Maldição de Strahd - Capítulo 1",
    "description": "Uma aventura sombria...",
    "gameSystem": "D&D 5e",
    "maxPlayers": 5,
    "price": 45.00,
    "duration": 240,
    "status": "OPEN",
    "locationType": "VENUE",
    "scheduledAt": "2025-01-25T14:00:00.000Z",
    "master": { ... },
    "venue": { ... },
    "bookings": [
      {
        "id": "booking_123",
        "status": "CONFIRMED",
        "user": {
          "name": "João Aventureiro"
        }
      }
    ],
    "reviews": [],
    "_count": {
      "bookings": 1
    }
  }
}
```

#### POST /api/sessions

Cria uma nova sessão (apenas mestres).

```bash
# curl
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cyberpunk RED - Ruas de Night City",
    "description": "Bem-vindos a Night City...",
    "gameSystem": "Cyberpunk RED",
    "maxPlayers": 4,
    "price": 35.00,
    "duration": 180,
    "scheduledAt": "2025-01-27T19:00:00.000Z",
    "locationType": "ONLINE"
  }' \
  http://localhost:3001/api/sessions

# httpie
http POST http://localhost:3001/api/sessions \
  Authorization:"Bearer YOUR_TOKEN" \
  title="Cyberpunk RED - Ruas de Night City" \
  description="Bem-vindos a Night City..." \
  gameSystem="Cyberpunk RED" \
  maxPlayers:=4 \
  price:=35.00 \
  duration:=180 \
  scheduledAt="2025-01-27T19:00:00.000Z" \
  locationType="ONLINE"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "session_456",
    "title": "Cyberpunk RED - Ruas de Night City",
    ...
  }
}
```

#### PUT /api/sessions/:id

Atualiza uma sessão (apenas o mestre dono).

```bash
# curl
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 40.00,
    "maxPlayers": 5
  }' \
  http://localhost:3001/api/sessions/session_456

# httpie
http PUT http://localhost:3001/api/sessions/session_456 \
  Authorization:"Bearer YOUR_TOKEN" \
  price:=40.00 \
  maxPlayers:=5
```

#### DELETE /api/sessions/:id

Cancela uma sessão (apenas o mestre dono).

```bash
# curl
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/sessions/session_456

# httpie
http DELETE http://localhost:3001/api/sessions/session_456 \
  Authorization:"Bearer YOUR_TOKEN"
```

---

### Booking Routes

#### GET /api/bookings/my

Lista as reservas do usuário autenticado.

```bash
# curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/bookings/my

# httpie
http GET http://localhost:3001/api/bookings/my \
  Authorization:"Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "booking_123",
      "status": "CONFIRMED",
      "amount": 45.0,
      "createdAt": "2025-01-18T10:00:00.000Z",
      "session": {
        "id": "session_123",
        "title": "A Maldição de Strahd - Capítulo 1",
        "scheduledAt": "2025-01-25T14:00:00.000Z",
        "master": {
          "user": {
            "name": "Alex Dungeon Master"
          }
        },
        "venue": {
          "name": "Caverna do Dragão"
        }
      }
    }
  ],
  "count": 1
}
```

#### POST /api/bookings

Cria uma nova reserva.

```bash
# curl
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_123"
  }' \
  http://localhost:3001/api/bookings

# httpie
http POST http://localhost:3001/api/bookings \
  Authorization:"Bearer YOUR_TOKEN" \
  sessionId="session_123"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "booking_789",
    "status": "PENDING",
    "amount": 45.0,
    "session": {
      "title": "A Maldição de Strahd - Capítulo 1"
    }
  }
}
```

#### PUT /api/bookings/:id/confirm

Confirma uma reserva (simula pagamento).

```bash
# curl
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/bookings/booking_789/confirm

# httpie
http PUT http://localhost:3001/api/bookings/booking_789/confirm \
  Authorization:"Bearer YOUR_TOKEN"
```

#### DELETE /api/bookings/:id

Cancela uma reserva (até 2h antes da sessão).

```bash
# curl
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/bookings/booking_789

# httpie
http DELETE http://localhost:3001/api/bookings/booking_789 \
  Authorization:"Bearer YOUR_TOKEN"
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 3,
      "path": ["title"],
      "message": "String must contain at least 3 character(s)"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Access denied. Required roles: MASTER"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Session not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Testing with Docker

```bash
# Start services
pnpm docker:up

# Wait for services to be ready
sleep 10

# Test health check
curl http://localhost:3001/healthz

# View API logs
pnpm docker:logs:api
```

---

## Rate Limiting

A API tem rate limiting configurado:

- **100 requests por minuto** por IP
- Headers de resposta incluem:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Timestamp do reset

---

## CORS

CORS está habilitado para:

- Desenvolvimento: `http://localhost:3000` (frontend)
- Produção: Configurar via `CORS_ORIGIN` no `.env`
