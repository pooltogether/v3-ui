const request = require("request")

exports.handler = (event, context, callback) => {
  request({
    method: 'GET',
    url: `https://api.coingecko.com/api/v3/simple/price?ids=dai,usd-coin,tether&vs_currencies=eth,usd,cad`
  }, (error, response, body) => {
    if (error) {
      // console.log(error)
      // console.log(response)
      // console.log(body)
      callback(error, null)
    }
    console.log("Body: " + JSON.parse(body))
    // console.log("Status Code: " + response.statusCode)

    if (response.statusCode < 300) {
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
      // console.log("Error", bodyObject)
      callback(bodyObject, {
        body: JSON.stringify({
          
        })
      })
    }

  })

}