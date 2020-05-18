import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

const AllTagsTemplate = ({ data, pageContext }) => {
  const { tags } = pageContext
  return (
    <Layout>
      <div>
        <ul>
          {tags &&
            tags.map((tagName, index) => {
              return (
                <li key={index}>
                  <Link to={`/tags/${tagName}`}>{tagName}</Link>
                </li>
              )
            })}
        </ul>
      </div>
    </Layout>
  )
}

export default AllTagsTemplate
