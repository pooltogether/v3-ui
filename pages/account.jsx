import React, { useState } from 'react'

import { Tab, Tabs, Content, ContentPane } from 'lib/components/Tabs'
import { WalletInfo } from 'lib/components/WalletInfo'

export default function Account(props) {
  const HOLDINGS = 'holdings'
  const SETTINGS = 'settings'

  const [visible, setVisible] = useState(HOLDINGS)

  const handleShowSettings = (e) => {
    e.preventDefault()

    setVisible(SETTINGS)
  }

  const handleShowHoldings = (e) => {
    e.preventDefault()

    setVisible(HOLDINGS)
  }

  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center rounded-lg'
    >
      <div>
        <Tabs>
          <div
            className='text-base sm:text-xl text-inverse'
          >
            Your account
          </div>
          <div>
            <Tab
              isSelected={visible === HOLDINGS}
              onClick={handleShowHoldings}
            >
              Holdings
            </Tab>
            <Tab
              isSelected={visible === SETTINGS}
              onClick={handleShowSettings}
            >
              Settings
            </Tab>
          </div>
        </Tabs>

        <Content>

          <ContentPane isSelected={visible === HOLDINGS}>
            <div
              className='flex flex-col sm:flex-wrap sm:flex-row items-center justify-center text-center text-xl mx-2 sm:mx-10 py-1'
            >
              Your tickets ...
            </div>
          </ContentPane>

          <ContentPane
            isSelected={visible === SETTINGS}
          >
            <div
              className='flex flex-col sm:flex-wrap sm:flex-row items-center justify-center text-center text-xl mx-2 sm:mx-10'
            >
              <WalletInfo
                {...props}
              />
            </div>
          </ContentPane>

        </Content>
      </div>
    </div>
  </>
}
