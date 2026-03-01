import { vi } from 'vitest'

// Mock next/navigation for tests that import components using it
export const usePathname = vi.fn(() => '/')
export const useSearchParams = vi.fn(() => new URLSearchParams())
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}))
export const useParams = vi.fn(() => ({}))
export const redirect = vi.fn()
export const notFound = vi.fn()
