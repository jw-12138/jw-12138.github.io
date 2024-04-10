import {visit} from 'unist-util-visit'
import pangu from 'pangu'

export default function remarkPluginText() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      node.value = pangu.spacing(node.value)
    })
  }
}
