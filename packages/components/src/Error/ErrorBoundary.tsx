import React, { ReactNode } from 'react'

export class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode | null },
  { hasError: boolean }
> {
  state: { hasError: boolean }

  constructor(props: { fallback: ReactNode; children: ReactNode | null }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error, hasError: true }
  }

  componentDidCatch(error: any, info: { componentStack: any }) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}
