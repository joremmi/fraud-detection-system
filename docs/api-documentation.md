# API Documentation

## Endpoints

### Transaction Validation
`POST /api/v1/validate`

Validates a transaction for potential fraud.

**Request:**
```json
{
  "amount": 100.00,
  "userId": "user_123",
  "timestamp": "2025-03-12T15:30:00Z",
  "location": "New York",
  "deviceId": "device_456"
}
```

**Response:**
```json
{
  "isValid": true,
  "riskScore": 0.12,
  "flags": [],
  "transactionId": "tx_789"
}
```

### Settings Management
`GET /api/v1/settings`
`POST /api/v1/settings`

Manage fraud detection thresholds and configurations.

## WebSocket Events

### Real-time Alerts
```typescript
socket.on('fraudAlert', (alert) => {
  console.log('Fraud alert received:', alert);
});
```