// Mock auth - in a real app this would integrate with a proper auth system
// For this testbed, we'll use a hardcoded user ID that can be set via cookies or header

const MOCK_USER_ID = 'user-1'

export function getCurrentUserId(): string {
  return MOCK_USER_ID
}

export function isAuthenticated(): boolean {
  return true
}
