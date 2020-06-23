const request = require("request")

function pickFields(obj) {
  const {
    fast,
    fastest,
    safeLow,
    average,
    safeLowWait,
    avgWait,
    fastWait,
    fastestWait
  } = obj

  return {
    fast,
    fastest,
    safeLow,
    average,
    safeLowWait,
    avgWait,
    fastWait,
    fastestWait
  }
}

exports.handler = (event, context, callback) => {
  // console.log(event)

  request({
    method: 'GET',
    url: `https://ethgasstation.info/json/ethgasAPI.json`
  }, (error, response, body) => {
    if (error) {
      // console.log(error)
      // console.log(response)
      // console.log(body)
      callback(error, null)
    }

    const bodyObject = JSON.parse(body)

    // console.log("Body: " + JSON.stringify(bodyObject))
    // console.log("Status Code: " + response.statusCode)

    if (response.statusCode < 300) {
      callback(null, {
        statusCode: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true"
        },
        body: JSON.stringify(
          pickFields(bodyObject)
        )
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