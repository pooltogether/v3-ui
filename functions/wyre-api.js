import { axiosInstance } from '../lib/axiosInstance'

function wyreApiUrl() {
  return process.env.SENDWYRE_API_SECRET ?
    'https://api.sendwyre.com' :
    'https://api.testwyre.com'
}

//       "amount": 10,
//       "sourceCurrency": "EUR",
//       "destCurrency": "ETH",
//       "referrerAccountId": "AC_CVZ4AYV8CN8",
//       "email": "user@sendwyre.com",
//       "dest": "ethereum:0x9E01E0E60dF079136a7a1d4ed97d709D5Fe3e341",
//       "firstName": "",
//       "city": "",
//       "phone": "+111111111",
//       "street1": "",
//       "country": "", //alpha2 country code
//       "redirectUrl": "https://google.com",
//       "failureRedirectUrl": "https://google.com",
//       "paymentMethod": "debit-card",        
//       "state": "", // state code  
//       "postalCode": "", 
//       "lastName": "surname",
//       "lockFields": [
//         "amount"...
//       ]
async function reserveOrder(event, callback) {
  const {
    path,
    dest,
    destCurrency
  } = JSON.parse(event.body)

  const url = `${wyreApiUrl()}${path}`

  const token = process.env.SENDWYRE_API_SECRET || process.env.TESTWYRE_API_SECRET

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
    }
  }

  const referrerAccountId = process.env.NEXT_JS_SENDWYRE_ACCOUNT_ID || process.env.NEXT_JS_TESTWYRE_ACCOUNT_ID

  const params = {
    dest,
    destCurrency,
    referrerAccountId
  }

  console.log(params)

  let result
  try {
    result = await axiosInstance.post(
      url,
      params,
      config
    )

    if (result.status < 300) {
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

exports.handler = (event, context, callback) => {
  const { path } = JSON.parse(event.body)
  
  if (path === '/v3/orders/reserve') {
    reserveOrder(event, callback)
  }
}
