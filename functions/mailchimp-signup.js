const request = require("request")

const mailChimpAPI = process.env.MAILCHIMP_API_KEY
const daiMailChimpListID = process.env.MAILCHIMP_DAI_LIST_ID
const usdcMailChimpListID = process.env.MAILCHIMP_USDC_LIST_ID
const mcRegion = process.env.MAILCHIMP_REGION

exports.handler = (event, context, callback) => {
  const formData = JSON.parse(event.body)
  const email = formData.email
  const ticker = formData.ticker

  let errorMessage = null

  if (!formData) {
    errorMessage = "No form data supplied"
    // console.log(errorMessage)
    callback(errorMessage)
  }

  if (!email) {
    errorMessage = "No EMAIL supplied"
    // console.log(errorMessage)
    callback(errorMessage)
  }
  
  if (!daiMailChimpListID || !usdcMailChimpListID) {
    errorMessage = "No LIST_ID supplied"
    // console.log(errorMessage)
    callback(errorMessage)
  }

  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {}
  }

  const subscriber = JSON.stringify(data)
  // console.log("Sending data to mailchimp", subscriber)

  const listId = ticker.toLowerCase() === 'usdc' ?
    usdcMailChimpListID :
    daiMailChimpListID

  request({
    method: "POST",
    url: `https://${mcRegion}.api.mailchimp.com/3.0/lists/${listId}/members`,
    body: subscriber,
    headers: {
      "Authorization": `apikey ${mailChimpAPI}`,
      "Content-Type": "application/json"
    }
  }, (error, response, body) => {
    if (error) {
      // console.log(error)
      // console.log(response)
      // console.log(body)
      callback(error, null)
    }
    const bodyObject = JSON.parse(body)

    // console.log("Mailchimp body: " + JSON.stringify(bodyObject))
    // console.log("Status Code: " + response.statusCode)

    if (response.statusCode < 300 || (bodyObject.status === 400 && bodyObject.title === "Member Exists")) {
      // console.log("Added to list in Mailchimp subscriber list")
      callback(null, {
        statusCode: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true"
        },
        body: JSON.stringify({
          status: "saved email"
        })
      })
    } else {
      // console.log("Error from mailchimp", bodyObject)
      // console.log("Error from mailchimp", bodyObject.detail)
      callback(bodyObject.detail, null)
    }

  })

}