import { ExternalLink, LinkTheme, SquareLink } from '@pooltogether/react-components'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'

export const WhatsV4 = (props: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames(
        'rounded-xl bg-white bg-opacity-100 dark:bg-opacity-10 dark:bg-actually-black p-4 space-y-4',
        props.className
      )}
    >
      {/* <h4>{t('whatIsV4Question')}</h4> */}
      <div>
        <h3>PoolTogether Version 4</h3>
        <p>{t('v4SimpleExplainer')}</p>
      </div>
      <div className='text-xl font-bold'>
        <span className=''>{t('v3MigrateQuestion')}</span>
        <ol className='pl-8 list-decimal'>
          <li>
            <ExternalLink
              colorClassName='transition-color text-pt-teal-dark dark:text-pt-teal hover:text-pt-purple-darkest dark:hover:text-white'
              href='https://app.pooltogether.com/account'
            >
              {t('withdrawFromV3')}
            </ExternalLink>
          </li>
          <li>
            <div className='flex'>
              <ExternalLink
                colorClassName='transition-color text-pt-teal-dark dark:text-pt-teal hover:text-pt-purple-darkest dark:hover:text-white'
                href='https://tools.pooltogether.com/token-faucet'
              >
                {t('claimV3Rewards')}
              </ExternalLink>
            </div>
          </li>
          <li>
            <ExternalLink
              colorClassName='transition-color text-pt-teal-dark dark:text-pt-teal hover:text-pt-purple-darkest dark:hover:text-white'
              href='https://app.pooltogether.com/deposit'
            >
              {t('depositIntoV4')}
            </ExternalLink>
          </li>
        </ol>
      </div>
      <p>
        <span>{t('v3MigrationClosing')}</span>
      </p>
    </div>
  )
}
