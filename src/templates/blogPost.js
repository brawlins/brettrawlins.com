import React from "react"
import { graphql, Link } from "gatsby"
import { css } from "@emotion/react"

import Layout from "../components/layout"
import SEO from "../components/seo"

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
        <p
          css={css`
            color: #aaa;
          `}
        >
          {date}
        </p>
        <div className="blogPost" dangerouslySetInnerHTML={{ __html: html }} />

        {tags.length ? (
          <div css={tagsWrapper}>
            <span>Tags:</span>
            {tags.map(tagName => (
              <Link key={tagName} to={`/tags/${tagName}`}>
                #{tagName}
              </Link>
            ))}
          </div>
        ) : null}
        <div css={navLinksWrapper}>
          {prev && (
            <Link to={prev.fields.slug}>
              &laquo; {prev.frontmatter.title}
            </Link>
          )}
          {next && (
            <Link to={next.fields.slug}>
              {next.frontmatter.title} &raquo;
            </Link>
          )}
        </div>
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
        date(formatString: "LL")
        tags
      }
      fields {
        slug
      }
    }
  }
`

export default Template

const tagsWrapper = css`
  display: flex;
  margin-top: 2em;
  margin-bottom: 2em;

  span {
    font-weight: bold;
    margin-right: 5px;
  }
  a {
    margin-right: 10px;
  }
`
const navLinksWrapper = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1em;

  a + a {
    margin-left: 10px;
  }
`
