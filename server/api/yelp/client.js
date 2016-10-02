import fetch from 'isomorphic-fetch'
import config from '~/config'

let creds = {}

async function search(term, categories) {
  if (!isValid(creds)) {
    creds = await getToken()
  }
  const url = 'https://api.yelp.com/v3/businesses/search?'
  const categoryString = categories ? `&categories=${categories}` : ''
  const response = await fetch(`${url}location=${term}${categoryString}`, {
    headers: {
      'Authorization': `Bearer ${creds.token}`
    }
  })
  let parsed
  try {
    parsed = await response.json()
  } catch (err) {
    parsed = await response.text()
  }
  return parsed
}

async function business(id) {
  if (!isValid(creds)) {
    creds = await getToken()
  }
  const url = 'https://api.yelp.com/v3/businesses/'
  const response = await fetch(`${url}${encodeURIComponent(id)}`, {
    headers: {
      'Authorization': `Bearer ${creds.token}`
    }
  })
  return await response.json()
}

async function getToken() {
  const reqTime = Date.now()
  const response = await fetch('https://api.yelp.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodeParams(config.yelp)
  })
  const json = await response.json()

  return {
    expires: reqTime + json.expires_in,
    token: json.access_token
  }
}

function encodeParams(yelp) {
  return [
    `grant_type=client_credentials`,
    `client_id=${encodeURIComponent(yelp.clientID)}`,
    `client_secret=${encodeURIComponent(yelp.clientSecret)}`
  ].join('&')
}

function isValid(creds) {
  return creds.token && creds.expires > Date.now()
}

export default {search, business}
