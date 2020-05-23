import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AllTagsTemplate = ({ data, pageContext }) => {
  const { tags } = pageContext
  return (
    <Layout>
      <SEO title="Tags" />
      <h1>Tags</h1>
      {tags &&
        tags.map((tagName, index) => {
          return (
            <div>
              <Link key={index} to={`/tags/${tagName}`}>
                # {tagName}
              </Link>
            </div>
          )
        })}
    </Layout>
  )
}

export default AllTagsTemplate
