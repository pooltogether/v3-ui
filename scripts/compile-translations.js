require('colors')

const JsDiff = require('diff')
const fs = require('fs')
const path = require('path')
const request = require('request')
const csv = require('csvtojson')

const I18N_KEY = 'key'
const cwd = path.dirname(fs.realpathSync(__filename))

const localesDir = '../public/static/locales'

// *** HTTP INPUT:
const masterInputCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSLo71DzCT8V4DUnOqc675Xp0gm2hIDSYUltq_CJwIVDTkjHUJ02mqq0IBCy-rbzOjmZl8qkyibFBLx/pub?output=csv'

const communityInputCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxPfHOZOAfef8aU6MDkCYDM5u2y0sRxHnObBDatRredtT2oRqoVAqws8Jq6RYAlTjHmJRrfa3wprHQ/pub?output=csv'

// *** FILE INPUT:
// const inputCsvFile = `${localesDir}/input/PoolTogether Translations - Sheet1.csv`
// const inputCsvFileAbsolute = path.join(cwd, inputCsvFile)

const masterSheet    = {}
const communitySheet = {}

addKeyValToOutput = (sheetObj, language, key, value) => {
  if (!sheetObj[language]) {
    sheetObj[language] = {}
  }
  
  if (sheetObj[language][key]) {
    console.warn('duplicate keys found for: ', language, key, value, '!')
  }

  sheetObj[language][key] = value
}

const processRow = (data, sheet) => {
  const jsonStr = data.toString('utf8')
  const obj = JSON.parse(jsonStr)
  const keyString = obj[I18N_KEY]
  const languages = Object.keys(obj).filter((key) => (key !== I18N_KEY))

  for (let i = 0; i < languages.length; i++) {
    const language = languages[i]
    const value = obj[language]

    const sheetObj = sheet === 'master' ? masterSheet : communitySheet

    addKeyValToOutput(sheetObj, language, keyString, value)
  }
}

writeJsonFiles = async () => {
  const languages = Object.keys(masterSheet).filter((key) => (key !== I18N_KEY))

  for (let i = 0; i < languages.length; i++) {
    console.log(``)

    const language = languages[i]
    const languageDir = path.join(cwd, `${localesDir}/${language}`)

    try {
      if (!fs.existsSync(languageDir)) {
        console.log(`${languageDir} does not exist! Creating ...`)
        fs.mkdirSync(languageDir, { recursive: true })
      }

      console.log(`Writing to ${languageDir}/common.json !`)
      fs.writeFileSync(
        `${languageDir}/common.json`,
        JSON.stringify(masterSheet[language]),
        'utf8'
      )
    } catch (error) {
      console.error('Error creating directory', error)
    }
    
  }
}

compile = async () => {
  console.log('Downloading Master translations from:', masterInputCsvUrl)
  console.log('...')

  await csv()
    .fromStream(request.get(masterInputCsvUrl))
    .on('data', (data) => {
      processRow(data, 'master')
    })
    .on('error', (err) => {
      console.error(err)
    })

  console.log('Downloading Community translations from:', communityInputCsvUrl, 'to test for differences.')
  console.log('...')

  await csv()
    .fromStream(request.get(communityInputCsvUrl))
    .on('data', (data) => {
      processRow(data, 'community')
    })
    .on('error', (err) => {
      console.error(err)
    })

  // await csv()
  //   .fromFile(inputCsvFileAbsolute)
  //   .on('data', processRow)
  //   .on('error', (err) => {
  //     console.log(err)
  //   })
}

diff = async () => {
  const masterLanguages = Object.keys(masterSheet).filter((key) => (key !== I18N_KEY))
  const communityLanguages = Object.keys(communitySheet).filter((key) => (key !== I18N_KEY))

  if (masterLanguages.length !== communityLanguages.length) {
    console.log(`Differing # of languages between the 2 sheets! `['red'])
    console.log(`Master sheet has ${masterLanguages.length}`['red'])
    console.log(`Community sheet has ${communityLanguages.length}`['red'])
  } else {
    console.log(`# of languages between the 2 sheets is the same `['green'])
  }

  for (let i = 0; i < masterLanguages.length; i++) {
    console.log(``)
    const language = masterLanguages[i]

    const keys = Object.keys(communitySheet[language])

    for (let y = 0; y < keys.length; y++) {
      const key = keys[y]

      if (key.match('\n') !== null) {
        console.log(`Key ${key} has a line break in it!`['red'])
      }
        

      const masterSheetKeys = Object.keys(masterSheet[language])
      if (!masterSheetKeys.includes(key)) {
        console.log(`${key} defined in community sheet but missing from master sheet!`['red'])
        console.log(`"${communitySheet[language][key]}"`['yellow'], 'vs', `"${masterSheet[language][key]}"`['blue'])
        return
      }

      const diff = JsDiff.diffChars(
        masterSheet[language][key],
        communitySheet[language][key]
      )

      diff.forEach(function (part) {
        var color = part.added ? 'green' :
          part.removed ? 'red' : ''

        if (part.added || part.removed) {
          console.log(`${key}, ${part.value[color]}`)
          // console.log(part)
        }
      })
    }
  }
}

void async function () {
  console.log('Skipping translations compilation!'['yellow'])
  return 0

  console.log('Compiling translations ...')
  console.log('')
  await compile()

  console.log('')
  console.log('')
  console.log('Writing master rows to lang files:')
  await writeJsonFiles()
  console.log('...')
  console.log('Done!'['blue'])

  console.log('')
  console.log('Comparing community and master language sheets for differences ...')
  await diff()
  console.log('')
  console.log('')
  console.log('Done!'['blue'])
}()
