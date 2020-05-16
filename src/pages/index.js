import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { getPathToPost } from "../utils/formatters"

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title="Home" />
      <ul>
        {edges.map(edge => {
          const { frontmatter, excerpt } = edge.node
          const { title, date } = frontmatter
          const path = getPathToPost(title)
          return (
            <li>
              <Link key={path} to={path}>
                {title}
              </Link>
              <div>{excerpt}</div>
            </li>
          )
        })}
      </ul>
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
