import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { css } from "@emotion/core"

const Header = ({ siteTitle }) => (
  <header
    css={css`
      background: #38AECC;
      margin-bottom: 1.45rem;
    `}
  >
    <style dangerouslySetInnerHTML={{__html: `.no-js {display: hidden}`}} />
    <div
      css={css`
        margin: 0 auto;
        max-width: 960px;
        padding: 1em;
      `}
    >
      <h1 css={css`
        font-size: 30px;
        margin: 0;
      `}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
