const request = require("request")

exports.handler = (event, context, callback) => {
  const { addressesString } = JSON.parse(event.body)
  // console.log(addressesString)

  request({
    method: 'GET',
    url: `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addressesString}&vs_currencies=eth%2Cusd%2Ccad`
    // url: `https://api.coingecko.com/api/v3/simple/price?ids=dai,usd-coin,tether&vs_currencies=eth,usd,cad`
  }, (error, response, body) => {
    if (error) {
      console.log(error)
      console.log(response)
      console.log(body)
      callback(error, null)
    }

    console.log("Status Code: " + response.statusCode)

    if (response.statusCode < 300) {
      console.log("Body: " + JSON.parse(body))

      callback(null, {
        statusCode: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true"
        },
        body
      })
    } else {
      console.log("Error", bodyObject)
      // callback(bodyObject, {
      //   body: JSON.stringify({
          
      //   })
      // })
    }

  })

}