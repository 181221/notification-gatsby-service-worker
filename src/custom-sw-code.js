self.addEventListener("push", e => {
  const data = e.data.json()
  console.log("Push Recieved...", data)
  self.registration.showNotification(data.title, {
    body: "Notified by Prisma server Media!",
  })
})
