import {visit} from 'unist-util-visit'

export default function remarkPluginImage() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      node.type = 'html'
      node.children = undefined
      if (node.alt === 'video' || node.url.endsWith('.mp4')) {
        node.value = `<video src="${node.url}" controls playsinline loop muted></video>`
      } else {
        const paramsStyleWhiteList = [
          'width',
          'height'
        ]

        const paramsElementWhiteList = [
          'figcaption'
        ]

        let style = ''
        let nodeUrl = node.url
        let figure = ''

        if(node.url.split('?')[1]){
          let [url, params] = node.url.split('?')

          nodeUrl = url

          let paramsObj = {}
          params.split('&').forEach((param) => {
            let [key, value] = param.split('=')
            if (paramsStyleWhiteList.includes(key)) {
              paramsObj[key] = value
            }

            if (paramsElementWhiteList.includes(key)) {
              figure = `<span class="figure">${node.alt}</span>`
            }
          })

          // loop the keys in the paramsObj and add them to the style string
          for (let key in paramsObj) {
            style += `${key}:${paramsObj[key]};`
          }
        }

        node.value = `<img src="${nodeUrl}" alt="${node.alt}" style="${style}" loading="lazy"/> ${figure}`
      }
    })
  }
}
