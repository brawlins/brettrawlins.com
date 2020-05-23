import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not Found" />
    <h1>Oops!</h1>
    <p>Looks like the page you’re looking for does not exist.</p>
  </Layout>
)

export default NotFoundPage
