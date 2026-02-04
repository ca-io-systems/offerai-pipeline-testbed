import { ReactNode, Suspense } from 'react'

type SuspenseBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
}

export function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
