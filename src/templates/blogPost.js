import React from "react"
import { graphql, Link } from "gatsby"
import { css } from "@emotion/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { formatDate, getPathToPost } from "../utils/formatters"

const Template = ({ data, pageContext }) => {
  const { next, prev } = pageContext
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  const { title, date, tags } = frontmatter

  return (
    <Layout>
      <SEO title={title} />
      <div>
        <h1>{title}</h1>
        <p css={css`color: #aaa;`}>{formatDate(date)}</p>
        <div className="blogPost" dangerouslySetInnerHTML={{ __html: html }} />
        <div css={tagsWrapper}>
          {tags.length
            ? tags.map(tagName => (<Link key={tagName} to={`/tags/${tagName}`}>#{tagName}</Link>))
            : null
          }
        </div>
        {prev && <Link css={css`margin-right: 5px;`} to={getPathToPost(prev.frontmatter.title)}>&laquo; Prev</Link>}
        {next && <Link css={css`margin-left: 5px;`} to={getPathToPost(next.frontmatter.title)}>Next &raquo;</Link>}
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
        tags
      }
    }
  }
`

export default Template

const tagsWrapper = css`
  display: flex;
  margin-bottom: 1em;

  a {
    margin-right: 10px;
  }
`
