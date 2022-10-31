import { ExternalLink, LinkTheme, SquareLink } from '@pooltogether/react-components'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'

export const WhatsV4 = (props: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames(
        'rounded-xl bg-opacity-10 bg-actually-black p-4 space-y-4',
        props.className
      )}
    >
      {/* <h4>{t('whatIsV4Question')}</h4> */}
      <div>
        <h3>PoolTogether Version 4</h3>
        <p>{t('v4SimpleExplainer')}</p>
      </div>
      <div className='text-2xl font-bold'>
        <span className=''>{t('v3MigrateQuestion')}</span>
        <ol className='pl-8 list-decimal'>
          <li>
            <ExternalLink theme={LinkTheme.accent} href='https://app.pooltogether.com/account'>
              {t('withdrawFromV3')}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink theme={LinkTheme.accent} href='https://app.pooltogether.com/deposit'>
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
