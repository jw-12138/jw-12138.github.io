import nodeHtmlToImage from 'node-html-to-image'
import fs from 'fs'

function fancyLog(message) {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`)
}

let args = process.argv.slice(2)

let jsonText = await fetch('http://localhost:4321/posts.json')

let posts = await jsonText.json()

let generateAll

if (args.length > 0) {
  if (args[0] === 'all') {
    generateAll = true
  } else {
    generateAll = false
    posts = posts.filter((p) => {
      return p.slug === args[0]
    })
  }
} else {
  // only generate the first one
  posts = [posts[0]]
  generateAll = false
}

if (!fs.existsSync('./public/og')) {
  fancyLog('creating og directory')
  fs.mkdirSync('./public/og')
  fancyLog('og directory created')
}

const favIcon = fs.readFileSync('./public/favicon.ico')
const base64Image = new Buffer.from(favIcon).toString('base64')
const dataURI = 'data:image/png;base64,' + base64Image

const ogBg = fs.readFileSync('./public/og-bg.png')
const base64Bg = new Buffer.from(ogBg).toString('base64')
const bgDataURI = 'data:image/png;base64,' + base64Bg

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 48px;
  }
  body {
    width: 1200px;
    height: 630px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    padding: 4rem 2rem 2rem;
    font-family: JetBrains Mono, monospace, Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,serif;
    background-image: url({{bgDataURI}});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
  }
  </style>
  <title>Open Graph</title>
</head>

<body>
  <div style="position: absolute; left: 2rem; top: 2rem;">
    <img src="{{logoUrl}}" alt="logo" style="width: 2rem; height: 2rem; position: relative">
  </div>
  <div style="width: 100%; font-size: {{titleSize}}; line-height: 1.3; margin-top: 1rem; width: 21rem;">
  {{title}}
  </div>
  <div style="width: 100%; margin-top: 1rem; font-size: .8rem; opacity: 0.8">
  {{tags}}
  </div>
  <div style="margin-top: 1rem; opacity: .5; font-size: .5rem">
    {{url}}
  </div>
</body>
</html>
`

async function generateOg() {
  fancyLog('generating og images')

  let content = []

  posts.forEach((post, index) => {
    let titleCharLength = 0

    const maxFontSize = 1.5
    const minFontSize = 1.1
    let fontSize = 0

    post.title.split('').forEach((char) => {
      if (!!char.match(/\p{Script=Han}/u)) {
        titleCharLength += 2
      } else {
        titleCharLength += 1
      }
    })

    // page width / 48px = 25rem
    // 25rem - 4rem padding = 21rem
    let lineWidth = (1200 / 48) - (2 * 2)

    // 21rem / titleCharLength = fontSize
    let calculatedFontSize = lineWidth / Math.ceil((titleCharLength + 2) / 2)

    if (calculatedFontSize >= maxFontSize) {
      fontSize = maxFontSize
    } else if (calculatedFontSize <= minFontSize) {
      fontSize = minFontSize
    } else {
      fontSize = calculatedFontSize
    }

    content.push({
      logoUrl: dataURI,
      url: post.url,
      title: post.title,
      tags: post.tags.join(', '),
      bgDataURI: bgDataURI,
      titleSize: fontSize + 'rem',
      output: `./public/og/${post.slug}.jpg`
    })
  })

  let s = Date.now()
  await nodeHtmlToImage({
    html: html,
    type: 'jpeg',
    quality: 80,
    content: content
  })

  fancyLog(`done in ${Date.now() - s}ms`)
}

await generateOg()
