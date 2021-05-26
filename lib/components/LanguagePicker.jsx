import React, { useState } from 'react'

import { DropdownList } from 'lib/components/DropdownList'
import { useTranslation } from 'react-i18next'

export function LanguagePicker(props) {
  const langs = {
    en: {
      name: 'English',
      nativeName: 'English'
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español'
    },
    de: {
      name: 'German',
      nativeName: 'Deutsch'
    },
    fr: {
      name: 'French',
      nativeName: 'Français'
    },
    it: {
      name: 'Italian',
      nativeName: 'Italiana'
    },
    ko: {
      name: 'Korean',
      nativeName: '한국어 (韓國語)'
    },
    pt: {
      name: 'Portuguese',
      nativeName: 'Português'
    },
    tr: {
      name: 'Turkish',
      nativeName: 'Türkçe'
    },
    zh: {
      name: 'Zhōngwén',
      nativeName: '中文'
    }
  }

  const { i18n: i18next } = useTranslation()

  const [currentLang, setCurrentLang] = useState(i18next.language)

  const onValueSet = (newLang) => {
    setCurrentLang(newLang)
    i18next.changeLanguage(newLang)
  }

  const formatValue = (key) => {
    const lang = langs[key]

    return (
      <>
        {key.toUpperCase()} - <span className='capitalize'>{lang.nativeName.split(',')[0]}</span> (
        {lang.name.split(';')[0]})
      </>
    )
  }

  return (
    <div className='mt-1'>
      <DropdownList
        id='language-picker-dropdown'
        className='ml-2 xs:ml-4 mr-1 text-xxs sm:text-sm'
        label={currentLang?.toUpperCase()}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentLang}
        values={langs}
      />
    </div>
  )
}
