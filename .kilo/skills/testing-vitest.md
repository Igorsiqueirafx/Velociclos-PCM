# Testing Skill (Vitest + React Testing Library)

## Project Context
- Vitest 4.x for unit/integration tests
- React Testing Library for component tests
- jsdom environment
- Coverage with v8

## Setup

### Config
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

### Setup File
```ts
// vitest.setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next-auth
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock backend API
vi.mock('@/lib/api', () => ({
  api: vi.fn(),
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}))
```

## Component Testing

### Basic Component Test
```tsx
// components/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders all navigation links', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: /início/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cursos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /certificados/i })).toBeInTheDocument()
  })

  it('opens mobile menu on hamburger click', () => {
    render(<Header />)
    const button = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(button)
    expect(screen.getByRole('navigation')).toBeVisible()
  })
})
```

### Testing with Providers
```tsx
// test-utils.tsx
import { ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

const AllProviders = ({ children }: { children: ReactNode }) => (
  <SessionProvider session={null}>{children}</SessionProvider>
)

export function renderWithProviders(
  ui: ReactNode,
  options?: RenderOptions
) {
  return render(ui, { wrapper: AllProviders, ...options })
}
```

### Testing Client Components with Hooks
```tsx
// hooks/useScrollProgress.test.ts
import { renderHook, act } from '@testing-library/react'
import { useScrollProgress } from './useScrollProgress'

describe('useScrollProgress', () => {
  it('returns progress based on scroll position', () => {
    const { result } = renderHook(() => useScrollProgress())
    
    // Mock scroll
    Object.defineProperty(window, 'innerHeight', { value: 800 })
    window.scrollTo(0, 400)
    
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    
    expect(result.current.progress).toBeGreaterThan(0)
    expect(result.current.progress).toBeLessThanOrEqual(1)
  })
})
```

## API Route Testing
```ts
// app/api/lead/route.test.ts
import { POST } from './route'
import { NextRequest } from 'next/server'

describe('POST /api/lead', () => {
  it('creates lead and returns 201', async () => {
    const request = new NextRequest('http://localhost/api/lead', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    })
    
    const response = await POST(request)
    expect(response.status).toBe(201)
  })
})
```

## Commands
```bash
npm run test           # Run tests
npm run test:ui        # Visual test UI
npm run test:coverage  # Coverage report
npm run test -- --watch  # Watch mode
```

## Best Practices
- Test behavior, not implementation
- Use `screen.getByRole` for accessibility
- Mock external dependencies (APIs, server actions)
- Keep tests fast and isolated
- Aim for 80%+ coverage on critical paths