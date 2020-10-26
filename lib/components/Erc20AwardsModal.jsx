import React, { useContext, useState } from 'react'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { Modal } from 'lib/components/Modal'

export const Erc20AwardsModal = (props) => {
  const { t } = useTranslation()

  const [visible, setVisible] = useState(false)
  
  const { pool } = useContext(PoolDataContext)
  console.log(pool)

  const handleOpen = (e) => {
    e.preventDefault()

    setVisible(true)
  }
  
  const handleClose = (e) => {
    e.preventDefault()

    setVisible(false)
  }

  return <>
    <Button
      onClick={handleOpen}
      className='mt-2'
    >
      View other awards
    </Button>

    <Modal
      handleClose={handleClose}
      visible={visible}
      header={t('otherAwards')}
    >

      {pool?.externalErc20Awards?.length === 0 && <>
        Blank state msg
      </>}
      
      {pool?.externalErc20Awards?.length > 0 && <>
        <ul>
          {pool.externalErc20Awards.map(award => {
            return <li
              key={award.address}
            >
              {award.address}

            </li>
          })}        
        </ul>
      </>}
    </Modal>
  </>
}
