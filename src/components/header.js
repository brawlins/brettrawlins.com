import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { css } from "@emotion/core"

const Header = ({ siteTitle }) => (
  <header css={siteHeader}>
    <div>
      <h1>
        <Link
          to="/"
          style={{
            color: `#333`,
            textDecoration: `none`,
          }}
        >
          Brett Rawlins
        </Link>
      </h1>
      <nav>
        <Link to="/about" style={{ color: `#333`, textDecoration: `none`}}>About</Link>
      </nav>
    </div>
  </header>
)

const siteHeader = css`
  margin-bottom: 2em;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 960px;
    padding: 1em;
  }
  h1 {
    font-size: 22px;
    font-weight: normal;
    margin: 0;
  }
  nav {
    display: flex;
  }
`

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
