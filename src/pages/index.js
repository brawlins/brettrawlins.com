import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { formatDate, getPathToPost } from "../utils/formatters"

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title="Home" />
      <h2 css={css`margin-bottom: 40px;`}>Blog</h2>
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
