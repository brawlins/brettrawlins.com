/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// CSS for prism code syntax highlighting
require("prismjs/themes/prism.css")

// Used to prevent flash of unstyled content (FOUC). Remove this class after js loads.
exports.onClientEntry = () => {
  window.addEventListener("load", () => {
    document.body.className = document.body.className.replace(/\bno-js\b/, "")
  })
}

