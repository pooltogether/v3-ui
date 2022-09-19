import { ErrorLinks } from '@pages/404'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export function CustomErrorBoundary(props) {
  const { children } = props
  const { t } = useTranslation()

  return (
    <SentryErrorBoundary
      onError={(error) => {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/
        if (chunkFailedMessage.test(error.message)) {
          window.location.reload()
        }
      }}
      fallback={({ error, componentStack, resetError }) => (
        <div
          className='flex flex-col w-full'
          style={{
            minHeight: '100vh'
          }}
        >
          <div className='content mx-auto px-8'>
            <div className='mb-4 text-inverse pt-32 xs:pt-32 space-y-4'>
              <h1 className=''>👋</h1>
              <h4 className='dark:text-white'>{t('anErrorOccurredAndWeveBeenNotified')}</h4>
              <h6 className='text-accent-1'>{t('pleaseTryAgainSoon')}</h6>
              <ErrorLinks />

              <div>
                {t('stillHavingProblems', 'Still having problems?')}{' '}
                <button
                  className='font-semibold text-pt-red-light transition-colors hover:text-pt-red'
                  onClick={() => {
                    if (
                      window.confirm(
                        t(
                          'clearingStorageWarning',
                          'Continuing will clear the websites storage in your browser. This DOES NOT have any effect on your deposits.'
                        )
                      )
                    ) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}
                >
                  {t('tryClearingLocalStorage', 'Try clearing local storage')}.
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </SentryErrorBoundary>
  )
}
