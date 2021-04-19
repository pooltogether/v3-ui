import { ethers } from 'ethers'

/**
 * Converts all BigNumbers into actual instances of BigNumbers
 * @param {*} data json blob
 * @returns
 */
export const deserializeBigNumbers = (data) => {
  try {
    if (Array.isArray(data)) {
      data.forEach(deserializeBigNumbers)
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach(deserializeBigNumbers)
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          if (data[key]?.type === 'BigNumber') {
            data[key] = ethers.BigNumber.from(data[key])
          } else {
            deserializeBigNumbers(data[key])
          }
        }
      })
    }
    return data
  } catch (e) {
    return data
  }
}
