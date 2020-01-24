const publicVapidKey = process.env.PUBLIC_KEY
const user = typeof window !== "undefined" && localStorage.getItem("user")
const url = "http://localhost:4000"
const { createApolloFetch } = require("apollo-fetch")

const apolloFetch = createApolloFetch({
  uri: url,
})
apolloFetch.use(async ({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {} // Create the headers object if needed.
  }
  if (!options.headers["authorization"]) {
    let token = await handleRefreshToken(url, user)
    console.log("token", token)
    options.headers["authorization"] = `Bearer ${token}`
  }
  console.log(request)
  next()
})

export const urlBase64ToUint8Array = () => {
  const padding = "=".repeat((4 - (publicVapidKey.length % 4)) % 4)
  const base64 = (publicVapidKey + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64)

  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const handleRefreshToken = async (url, user) => {
  const ql = `mutation {
    getToken(
      email: "${user}"
    ) {
      token
    }
  }`
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ql,
    }),
  }
  const response = await fetch(url, options)
  const json = await response.json()
  return json.data.getToken.token
}

export const handleRequest = async subscription => {
  const query = `
  mutation UpdateUser ($email: String!, $subscription: String!) {
    updateUser(email: $email, subscription: $subscription) {
      name
      subscription
    }
  }
  `
  const variables = {
    email: user,
    subscription: subscription,
  }
  apolloFetch({ query, variables })
    .then(res => console.log(res))
    .catch(err => console.error(err))
}
