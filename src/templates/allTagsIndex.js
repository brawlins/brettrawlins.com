import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AllTagsTemplate = ({ pageContext }) => {
  const { tags } = pageContext
  return (
    <Layout>
      <SEO title="Tags" />
      <h1>Tags</h1>
      {tags &&
        tags.map(tagName => {
          return (
            <div>
              <Link key={tagName} to={`/tags/${tagName}`}>
                # {tagName}
              </Link>
            </div>
          )
        })}
    </Layout>
  )
}

export default AllTagsTemplate
