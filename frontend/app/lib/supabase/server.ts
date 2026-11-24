type AuthError = { message?: string } | null

interface MockAuth {
  getUser: () => Promise<{ data: { user: { id: string; email: string } | null }; error: AuthError }>
  signOut: () => Promise<{ error: AuthError }>
  signInWithPassword: (credentials?: unknown) => Promise<{ error: AuthError }>
  signInWithOAuth: (options?: unknown) => Promise<{ error: AuthError }>
  exchangeCodeForSession: (code?: string) => Promise<{ error: AuthError }>
  getClaims: () => Promise<{ data: { claims: Record<string, unknown> }; error: AuthError }>
}

interface MockClient {
  auth: MockAuth
}

export async function createClient(): Promise<MockClient> {
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: 'local-user', email: 'local@velociclos' } }, error: null }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ error: null }),
      signInWithOAuth: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({ error: null }),
      getClaims: async () => ({ data: { claims: {} }, error: null }),
    },
  }
}
