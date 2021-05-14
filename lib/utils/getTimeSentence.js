export const getTimeSentence = (t, years, weeks, days, hours, minutes, seconds) =>
  `${!years ? '' : years === 1 ? t('year') : `${years} ${t('years')}`}${
    years && (weeks || days || hours || minutes || seconds) ? ', ' : ''
  }${!weeks ? '' : weeks === 1 ? t('week') : `${weeks} ${t('weeks')}`}${
    weeks && (days || hours || minutes || seconds) ? ', ' : ''
  }${!days ? '' : days === 1 ? t('day') : `${days} ${t('days')}`}${
    days && (hours || minutes || seconds) ? ', ' : ''
  }${!hours ? '' : hours === 1 ? t('hour') : `${hours} ${t('hours')}`}${
    hours && (minutes || seconds) ? ', ' : ''
  }${!minutes ? '' : minutes === 1 ? t('minute') : `${minutes} ${t('minutes')}`}${
    minutes && seconds ? ', ' : ''
  }${!seconds ? '' : seconds === 1 ? t('second') : `${seconds} ${t('seconds')}`}`.toLowerCase()
