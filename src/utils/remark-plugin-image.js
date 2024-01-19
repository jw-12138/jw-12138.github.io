import {visit} from 'unist-util-visit'

export default function remarkPlugin() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      if (!node.data) {
        node.data = {}
      }

      if (!node.data.hProperties) {
        node.data.hProperties = {}
      }

      node.data.hProperties.loading = "lazy"
    })
  }
}
