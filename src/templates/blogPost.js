import React from "react"
import { graphql, Link } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import { formatDate, getPathToPost } from "../utils/formatters"

const Template = ({ data, pageContext }) => {
  const { next, prev } = pageContext
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  const { title, date } = frontmatter

  return (
    <Layout>
      <div>
        <h1>{title}</h1>
        <p css={css`color: #aaa;`}>{formatDate(date)}</p>
        <div className="blogPost" dangerouslySetInnerHTML={{ __html: html }} />
        {prev && <Link to={getPathToPost(prev.frontmatter.title)}>Prev</Link>}
        {next && <Link to={getPathToPost(next.frontmatter.title)}>Next</Link>}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        title
        date
      }
    }
  }
`

export default Template
