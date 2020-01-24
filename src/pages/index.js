import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import {
  isPushSupported,
  subscribePush,
  unsubscribePush,
  getSubscription,
} from "../components/notification"

const IndexPage = () => {
  const [value, setValue] = useState("")
  const onUnsub = async e => {
    await unsubscribePush()
  }
  const onChange = e => {
    setValue(e.target.value)
  }
  const onCLick = async e => {
    if (isPushSupported) {
      console.log("getting sub")
      let sub = await getSubscription()
      console.log("getting subscription", sub)
      if (sub) {
        console.log("allready subbed")
        return
      } else {
        console.log("saving subscription")
        await subscribePush()
      }
    }
  }
  const addUser = e => {
    localStorage.setItem("user", value)
  }
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <input value={value} onChange={onChange} />
      <button onClick={addUser}>add user to local storage</button>
      <button onClick={onCLick}>sub</button>
      <button onClick={onUnsub}>unsub</button>
      <p>
        Signed in user
        {typeof window !== "undefined" &&
          localStorage.getItem("user").toString()}
      </p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Link to="/page-2/">Go to page 2</Link>
    </Layout>
  )
}

export default IndexPage
