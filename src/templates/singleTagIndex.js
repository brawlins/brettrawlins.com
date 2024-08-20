import React from "react"
import { Link } from "gatsby"
import { css } from "@emotion/react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { pluralize } from "../utils/formatters"

const SingleTagTemplate = ({ pageContext }) => {
  const { posts, tagName } = pageContext
  let postCount = posts.length || 0
  let postCountString = postCount + " " + pluralize(postCount, "Post")

  return (
    <Layout>
      <SEO title={`#${tagName}`} />
      <div css={flexHeader}>
        <h1>#{tagName}</h1>
        <span>{postCountString}</span>
      </div>
      {posts &&
        posts.map((post, index) => {
          let { frontmatter, excerpt, fields } = post
          let { title } = frontmatter
          let { slug } = fields
          return (
            <div key={index} css={postWrapper}>
              <h2>
                <Link to={slug}>{title}</Link>
              </h2>
              <p>{excerpt}</p>
            </div>
          )
        })}
    </Layout>
  )
}

export default SingleTagTemplate

const flexHeader = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5em;
`
const postWrapper = css`
  margin-bottom: 2.5em;

  h2 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  p {
    margin: 0;
  }
`
