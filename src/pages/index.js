import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { getPathToPost, pluralize } from "../utils/formatters"

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark
  let postCount = edges.length || 0
  let postCountString = postCount + ' ' + pluralize(postCount, 'Post')

  return (
    <Layout>
      <SEO title="Home" />
      <div css={flexHeader}>
        <h2 css={css`margin: 0`}>Blog</h2>
        <span>{postCountString}</span>
      </div>
      {edges.map(edge => {
        const { frontmatter, excerpt } = edge.node
        const { title } = frontmatter
        const path = getPathToPost(title)
        return (
          <div css={postWrapper}>
            <h2>
              <Link key={path} to={path}>
                {title}
              </Link>
            </h2>
            <p>{excerpt}</p>
          </div>
        )
      })}
      <div>
        <Link to="/tags">Browse by tag</Link>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query markdownPosts {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          frontmatter {
            title
            date
          }
          excerpt
        }
      }
    }
  }
`

export default IndexPage

const flexHeader = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5em;

  span {
    margin-right: 20px;
  }
`

const postWrapper = css`
  margin-bottom: 2.5em;

  .postDate {
    color: #999;
    font-size: 0.8em;
    margin-bottom: 5px;
  }
  h2 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  p {
    margin: 0;
  }
`
