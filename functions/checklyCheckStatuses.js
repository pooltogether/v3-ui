import { axiosInstance } from '../lib/axiosInstance'

exports.handler = async (event, context, callback) => {
  const url = `https://api.checklyhq.com/v1/check-statuses`

  const token = process.env.CHECKLY_SECRET_KEY

  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    }

    const response = await axiosInstance.get(url, config)

    if (response && response.status === 404) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(null)
      }
    } else if (response && response.status === 401) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(null)
      }
    } else {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: response.data })
      }
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
