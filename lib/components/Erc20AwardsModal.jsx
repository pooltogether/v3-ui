import React, { useContext, useState } from 'react'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Modal } from 'lib/components/Modal'

export const Erc20AwardsModal = (props) => {
  const { t } = useTranslation()

  const [visible, setVisible] = useState(false)
  
  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  const handleClose = (e) => {
    e.preventDefault()

    setVisible(false)
  }

  if (supportedNetwork) {
    return null
  }
  
  return <>
    <Modal
      handleClose={handleClose}
      visible={visible}
      header={t('otherAwards')}
    >
      <ul>
        {poolData.}        
      </ul>
    </Modal>
  </>
}
