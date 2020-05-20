/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
// Prevent flash of unstyled content (FOUC) by adding this class temporarily while the javascript downloads
exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
      className: 'no-js'
    });
};