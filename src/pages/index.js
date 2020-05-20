import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { getPathToPost } from "../utils/formatters"

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title="Home" />
      <h2>Blog</h2>
      {edges.map(edge => {
        const { frontmatter, excerpt } = edge.node
        const { title, date } = frontmatter
        const path = getPathToPost(title)
        return (
          <div css={css`
            margin-bottom: 2em;
          `}>
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
