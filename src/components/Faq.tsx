import { ExternalLink, LinkTheme } from '@pooltogether/react-components'
import classNames from 'classnames'
import { Trans, useTranslation } from 'next-i18next'

export const Faq = (props: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames(
        'rounded-xl bg-white bg-opacity-100 dark:bg-opacity-10 dark:bg-actually-black p-4 space-y-4',
        props.className
      )}
    >
      <h3>FAQ</h3>
      <div>
        <h4>{t('whereAreMyTokens')}</h4>
        <p>
          <Trans
            i18nKey='depositIsInV3'
            components={{
              link1: (
                <ExternalLink
                  theme={LinkTheme.accent}
                  href='https://pooltogether.com/discord'
                  children={undefined}
                />
              ),
              link2: (
                <ExternalLink
                  theme={LinkTheme.accent}
                  href='https://v3.docs.pooltogether.com'
                  children={undefined}
                />
              )
            }}
          />
        </p>
      </div>
      <div>
        <h4>{t('whereAreMyPrizes')}</h4>
        <p>{t('whereAreMyPrizesAnswer')}</p>
      </div>
      <div>
        <h4>{t('whereAreMyDepositRewards')}</h4>
        <p>
          <Trans
            i18nKey={'whereAreMyDepositRewardsAnswer'}
            components={{
              link1: (
                <ExternalLink
                  theme={LinkTheme.accent}
                  href='https://tools.pooltogether.com/token-faucet'
                  children={undefined}
                />
              )
            }}
          />
        </p>
      </div>
    </div>
  )
}
