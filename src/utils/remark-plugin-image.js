import {visit} from 'unist-util-visit'

export default function remarkPluginImage() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      if (node.alt === 'video' || node.url.endsWith('.mp4')) {
        node.type = 'html'
        node.value = `<video src="${node.url}" controls playsinline loop muted></video>`
        node.children = undefined
      } else {
        if (!node.data) {
          node.data = {}
        }

        if (!node.data.hProperties) {
          node.data.hProperties = {}
        }

        node.data.hProperties.loading = 'lazy'

        const paramsWhiteList = [
          'width',
          'height'
        ]
        if(node.url.split('?')[1]){
          let [url, params] = node.url.split('?')

          node.url = url

          let paramsObj = {}
          params.split('&').forEach((param) => {
            let [key, value] = param.split('=')
            if (paramsWhiteList.includes(key)) {
              paramsObj[key] = value
            }
          })

          let style = ''

          // loop the keys in the paramsObj and add them to the style string
          for (let key in paramsObj) {
            style += `${key}:${paramsObj[key]};`
          }

          node.data.hProperties.style = style
        }
      }
    })
  }
}
