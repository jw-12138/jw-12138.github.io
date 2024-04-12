import fs from 'fs'

let jsonText = await fetch('http://localhost:4321/posts.json')

let posts = await jsonText.json()

let md = `# 一个球的博客

最近的十篇文章：

`

posts.slice(0, 10).forEach((p) => {
  md += `- [${p.title}](https://${p.url})  \n`
})

fs.writeFileSync('./README.md', md)
