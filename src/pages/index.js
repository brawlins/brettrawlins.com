import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { pluralize } from "../utils/formatters"

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark
  let postCount = edges.length || 0
  let postCountString = postCount + ' ' + pluralize(postCount, 'Post')

  return (
    <Layout>
      <SEO title="Home" />
      <div css={flexHeader}>
        <h1 css={css`margin: 0`}>Blog</h1>
        <span>{postCountString}</span>
      </div>
      {edges.map(edge => {
        const { frontmatter, excerpt, fields } = edge.node
        const { title } = frontmatter
        const { slug } = fields
        return (
          <div css={postWrapper}>
            <h2>
              <Link key={slug} to={slug}>
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
          fields {
            slug
          }
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
