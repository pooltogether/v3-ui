import React from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'

import PoolIcon from 'assets/images/holidays.svg'

export const Layout = (props) => {
  const {
    children
  } = props
  return <>
    <Meta />

    
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >
      {/* <StaticNetworkNotificationBanner /> */}

      <div
        className='pool-container flex flex-grow relative z-30 h-full page'
        // className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'
      >
        <div
          className='flex flex-col flex-grow'
        >
          <div
            id='top'
            className='main-nav relative spinner-hidden z-20 pt-2'
          >
            <Nav />
          </div>


          <div
            className='relative flex flex-col flex-grow h-full z-10 text-white'
            style={{
              flex: 1
            }}
          >
            <div
              className='px-4 sm:px-8 lg:px-12 my-4'
            >
              {React.cloneElement(children, {
                ...props,
              })}
            </div>
          </div>

          <div
            className='main-footer z-10'
          >
            <Footer />
          </div>
        </div>

      </div>
    </div>
    
    <ToastContainer
      className='pool-toast'
      position='top-center'
      autoClose={6000}
      transition={Slide}
    />
  </>
}
