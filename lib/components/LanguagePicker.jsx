import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from '@reach/menu-button'

import { i18n, useTranslation } from 'lib/../i18n'

{/* de: Deutsch (German)
  en: English
  es: Español (Spanish)
  fr: Français (French)
  hr: Hrvatski (Croatian)
  it: Italiana (Italian)
  ja: 日本 (Japanese)
                    ko: 한국어 (Korean)
                    tr: Türk (Turkish)
                    zh: 普通话 (Mandarin)
                      */}

export const LanguagePicker = (props) => {
  const [langs, setLangs] = useState({
    en: {
      'name': 'English',
      'nativeName': 'English'
    },
  })

  const [currentLang, setCurrentLang] = useState('en')

  const handleChangeLangClick = (newLang) => {
    setCurrentLang(newLang)
    i18n.changeLanguage(newLang)
  }

  // set lang to whatever i18n thinks it hould be (based
  // on lang detection or stored cookies)
  useEffect(() => {
    if (i18n.language) {
      setCurrentLang(i18n.language)
    }
  }, [])
  
  useEffect(() => {
    const runGetLangs = async () => {
      await i18n.services.backendConnector.backend.getLanguages((err, result) => {
        if (err) {
          console.error(`There was an error getting the languages from locize: `, err)
        }
        console.log(result)
        setLangs(result)
      })
    }
    runGetLangs()
  }, [])

  const activeLangs = Object.keys(langs).reduce(function (result, lang) {
    if (i18n.options.allLanguages.includes(lang)) {
      result.push(lang)
    }
    return result
  }, [])

  const menuItems = activeLangs.map(langKey => {
    const lang = langs[langKey]

    return <MenuItem
      key={`lang-picker-item-${langKey}`}
      onSelect={() => { handleChangeLangClick(langKey) }}
      className={classnames(
        {
          selected: langKey === currentLang
        }
      )}
    >
      {langKey.toUpperCase()} - <span className='capitalize'>
        {lang.nativeName.split(',')[0]}
      </span> ({lang.name.split(';')[0]})
    </MenuItem>
  })

  return <>
    <Menu>
      {({ isExpanded }) => (
        <>
          <MenuButton
            className={classnames(
              'inline-flex items-center justify-center trans ml-4 sm:ml-6 mr-2 sm:mr-4 my-2 hover:text-inverse font-bold inline-block text-xxs sm:text-base text-lg',
              {
                'text-highlight-2': !isExpanded,
                'text-highlight-1': isExpanded,
              }
            )}
            style={{
              minWidth: 50
            }}
          >
            {currentLang.toUpperCase()} <FeatherIcon
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
              className='relative w-4 h-4 inline-block ml-2'
              strokeWidth='0.15rem'
            />
          </MenuButton>

          <AnimatePresence>
            <motion.div
              animate='enter'
              variants={{
                enter: {
                  y: 0,
                  transition: {
                    duration: 0.1
                  }
                },
              }}
            >
              <MenuList
                animate='enter'
                variants={{
                  enter: {
                    y: 0,
                    transition: {
                      duration: 0.1
                    }
                  },
                }}
              >
                {menuItems}
              </MenuList>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </Menu>

  </>
}