import React, { useEffect, useState } from 'react'

import { i18n, useTranslation } from 'lib/../i18n'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

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

  const onValueSet = (newLang) => {
    i18n.changeLanguage(newLang)
    // console.log({ lang: i18n.language})
  }

  // set lang to whatever i18n thinks it should be (based
  // on lang detection or stored cookies)
  useEffect(() => {
    if (i18n.language) {
      setCurrentLang(i18n.language)
      // console.log({ lang: i18n.language })
    }
  }, [])
  
  useEffect(() => {
    const runGetLangs = async () => {
      await i18n.services.backendConnector.backend.getLanguages((err, result) => {
        if (err) {
          console.error(`There was an error getting the languages from locize: `, err)
        }
        // console.log(result)
        setLangs(result)
      })
    }
    runGetLangs()
  }, [])

  const formatValue = (key) => {
    const lang = langs[key]
    
    return <>
      {key.toUpperCase()} - <span className='capitalize'>
        {lang.nativeName.split(',')[0]}
      </span> ({lang.name.split(';')[0]})
    </>
  }

  return <>
    <DropdownInputGroup
      id='language-picker-dropdown'
      formatValue={formatValue}
      onValueSet={onValueSet}
      current={currentLang}
      values={langs}
    />

  </>
}