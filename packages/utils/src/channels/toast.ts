const toastChannel = new BroadcastChannel('toast')

export type ToastData = {
  message: string
  title?: string
  status?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const toast = {
  notify(config: {
    message: string
    title?: string
    status?: 'success' | 'error' | 'warning' | 'info'
    duration?: `${number}ms` | `${number}s`
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }) {
    const data = {
      ...config,
      duration: convertDuration(config.duration),
    }
    toastChannel.postMessage(data)
    const event = new MessageEvent('message', { data })
    toastChannel.dispatchEvent(event)
  },
  listen(callback: (config: ToastData) => void) {
    toastChannel.addEventListener('message', (event) => {
      if (event.data) {
        callback(event.data as ToastData)
      }
    })
  },
  close() {
    toastChannel.close()
  },
}

function convertDuration(duration?: string): number {
  if (!duration) return 5_000
  const match = duration.match(/^(\d+)(ms|s)$/)
  if (!match || match.length < 3) return 5_000
  const value = Number(match[1])
  return match[2] === 'ms' ? value : value * 1000
}
