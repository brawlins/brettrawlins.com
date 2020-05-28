/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")
const { getPathToPost } = require("./src/utils/formatters")

const createTagPages = (createPage, posts) => {
  const allTagsIndexTemplate = path.resolve("src/templates/allTagsIndex.js")
  const singleTagIndexTemplate = path.resolve("src/templates/singleTagIndex.js")
  const postsByTag = {}

  // Compile list of tags and the posts containing them
  posts.forEach(({ node }) => {
    let tags = node.frontmatter.tags
    if (tags) {
      tags.forEach(tag => {
        if (!postsByTag[tag]) {
          postsByTag[tag] = []
        }
        postsByTag[tag].push(node)
      })
    }
  })

  // Get just the tags
  const tags = Object.keys(postsByTag)

  // Create page for all tags
  createPage({
    path: "/tags",
    component: allTagsIndexTemplate,
    context: {
      tags: tags.sort(),
    },
  })

  // Create page for each individual tag
  tags.forEach(tagName => {
    const posts = postsByTag[tagName]
    createPage({
      path: `/tags/${tagName}`,
      component: singleTagIndexTemplate,
      context: {
        posts,
        tagName,
      },
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve("src/templates/blogPost.js")

    // Query to get list of posts, sorted by date
    resolve(
      graphql(`
        query {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
          ) {
            edges {
              node {
                frontmatter {
                  title
                  tags
                }
                excerpt
                fields {
                  slug
                }
              }
            }
          }
        }
      `).then(result => {
        const posts = result.data.allMarkdownRemark.edges
        createTagPages(createPage, posts)

        // Create page for each post
        posts.forEach(({ node }, index) => {
          const title = node.frontmatter.title
          const path = node.fields.slug
          createPage({
            path,
            component: blogPostTemplate,
            context: {
              // Used as unique ID to query for the post in the page template
              title: title,
              prev: index === 0 ? null : posts[index - 1].node,
              next: index === posts.length - 1 ? null : posts[index + 1].node,
            },
          })
          resolve()
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    // Get title from node
    let title = node.frontmatter.title
    // Create slug from title instead of filename
    let slug = getPathToPost(title);
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}
