import {visit} from 'unist-util-visit'

export default function remarkPluginLink() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (!node.data) {
          node.data = {}
        }

        if (!node.data.hProperties) {
          node.data.hProperties = {}
        }

        if(node.url.startsWith('https://jw1.dev')){
          node.data.hProperties.target = '_self'
        } else {
          node.data.hProperties.target = '_blank'
        }
    })
  }
}
