import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { getPathToPost } from "../utils/formatters"

const SingleTagTemplate = ({ data, pageContext }) => {
  const { posts, tagName } = pageContext
  return (
    <Layout>
      <SEO title={`#${tagName}`} />
      <div>
        <div>Posts about {tagName}</div>
        <ul>
          {posts &&
            posts.map((post, index) => {
              return (
                <li key={index}>
                  <Link to={getPathToPost(post.frontmatter.title)}>
                    {post.frontmatter.title}
                  </Link>
                </li>
              )
            })}
        </ul>
      </div>
    </Layout>
  )
}

export default SingleTagTemplate
