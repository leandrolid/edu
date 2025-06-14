'use client'

import { toast, type ToastData } from '@edu/utils'
import { CheckCircle, Info, WarningCircle, X, XCircle } from '@phosphor-icons/react/dist/ssr'
import { Button, Card } from '@radix-ui/themes'
import { Toast } from 'radix-ui'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './styles.module.css'

export function ToastProvider() {
  const [config, setConfig] = useState<ToastData | null>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    toast.listen((newConfig) => {
      setConfig({
        ...newConfig,
        position: newConfig.position || 'bottom-right',
      })
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setConfig(null), newConfig.duration || 5000)
    })
    return () => {
      toast.close()
    }
  }, [])

  return (
    <Toast.Provider
      swipeDirection={getSwipeDirection(config?.position)}
      duration={config?.duration}
    >
      {config && (
        <>
          <Card asChild>
            <Toast.Root
              className={styles.container}
              data-status={config.status}
              open
              onOpenChange={() => setConfig(null)}
            >
              {getStatusIcon(config.status)}
              <div className={styles.content}>
                {config.title && <Toast.Title className={styles.title}>Success</Toast.Title>}
                <Toast.Description className={styles.description}>
                  {config.message}
                </Toast.Description>
              </div>
              <Toast.Close asChild>
                <Button variant="ghost" color="gray" className={styles.close}>
                  <X weight={'bold'} />
                </Button>
              </Toast.Close>
            </Toast.Root>
          </Card>
          <Toast.Viewport
            className={styles.viewport}
            data-position={config.position || 'bottom-right'}
          />
        </>
      )}
    </Toast.Provider>
  )
}

const getStatusIcon = (status?: string) => {
  if (!status) return null
  const icons: Record<string, ReactNode> = {
    success: <CheckCircle weight={'fill'} />,
    warning: <WarningCircle weight={'fill'} />,
    error: <XCircle weight={'fill'} />,
    info: <Info weight={'fill'} />,
  }
  return icons[status]
}

function getSwipeDirection(position?: string): 'right' | 'left' {
  if (!position) return 'right'
  const [, direction] = position.split('-')
  return direction === 'left' ? 'left' : 'right'
}
