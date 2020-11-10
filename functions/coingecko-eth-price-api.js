import { axiosInstance } from '../lib/axiosInstance'

exports.handler = async (event, context, callback) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=cad%2Cusd&vs_currencies=usd%2Ccad`

  try {
    const result = await axiosInstance.get(
      url,
    )

    if (result.status < 400) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result.data)
      })
    } else {
      callback(result.error)
    }
  } catch (e) {
    callback(e)
  }

}