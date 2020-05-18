/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Global, css } from "@emotion/core"
import styled from "@emotion/styled"

import Header from "./header"
import "./layout.css"

const GlobalStylesWrapper = styled.div``

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <GlobalStylesWrapper>
        <Global
          styles={css`
            body {
              background-color: #fff;
              color: #333;
              font-family: "Merriweather";
            }
            h1, h2, h3, h4, h5, h6 {
              font-family: "Roboto";
              margin-top: .4em;
              margin-bottom: .6em;
            }
            p {
              margin-bottom: 1.5em;
            }
            pre, pre[class*="language-"] {
              margin-bottom: 1.5em;
            }
            a, a:link, a:visited, a:hover, a:active {
              color: #3891A6;
            }
            a:hover, a:active {
              color: #046E8F;
              text-decoration: underline;
            }
            h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {
              text-decoration: none;
            }
          `}
        />
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0 1.0875rem 1.45rem`,
          }}
        >
          <main>{children}</main>
          <footer css={css`
            margin-top: 30px;
          `}>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
      </GlobalStylesWrapper>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
