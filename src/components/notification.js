import { urlBase64ToUint8Array, handleRequest } from "../components/utils"

//To check `push notification` is supported or not
export const getSubscription = async () => {
  const serviceWorker = await navigator.serviceWorker.ready
  const sub = await serviceWorker.pushManager.getSubscription()
  return sub
}
export const isPushSupported = () => {
  //To check `push notification` permission is denied by user
  if (Notification.permission === "denied") {
    alert("User has blocked push notification.")
    return
  }

  //Check `push notification` is supported or not
  if (!("PushManager" in window)) {
    alert("Sorry, Push notification isn't supported in your browser.")
    return
  }
}
export const subscribePush = async () => {
  const serviceWorker = await navigator.serviceWorker.ready
  if (!serviceWorker.pushManager) {
    alert("Your browser doesn't support push notification.")
    return false
  }
  const subscription = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(),
  })
  const stringifySub = JSON.stringify(subscription)
  let response = await handleRequest(stringifySub)
  console.info("Push notification subscribed.")
  console.log(response)
}

export const unsubscribePush = async () => {
  const subscription = await getSubscription()
  if (!subscription) {
    alert("Unable to unregister push notification.")
    return
  }
  subscription
    .unsubscribe()
    .then(function() {
      console.info("Push notification unsubscribed.")
      console.log(subscription)
      deleteSubscriptionID(subscription)
    })
    .catch(function(error) {
      console.error(error)
    })
}
export const deleteSubscriptionID = async subscription => {
  let response = await handleRequest("")
  console.log("reponse", response)
}
