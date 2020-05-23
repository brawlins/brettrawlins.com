import React from "react"
import { graphql, Link } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { getPathToPost, pluralize } from "../utils/formatters"

const SingleTagTemplate = ({ data, pageContext }) => {
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
          let { frontmatter, excerpt } = post
          let { title } = frontmatter
          return (
            <div key={index} css={postWrapper}>
              <h2>
                <Link to={getPathToPost(title)}>{title}</Link>
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
