// Simplified auth for demo - in production this would check session/JWT
const DEMO_HOST_ID = 'host-1'

export function getCurrentHostId(): string {
  return DEMO_HOST_ID
}

export function requireHostAuth(): string {
  const hostId = getCurrentHostId()
  if (!hostId) {
    throw new Error('Unauthorized: Host authentication required')
  }
  return hostId
}
