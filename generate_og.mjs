import nodeHtmlToImage from 'node-html-to-image'
import fs from 'fs'

const start = Date.now()

function fancyLog(message) {
  console.log(`[${new Date()}] ${message}`)
}

let args = process.argv.slice(2)

let jsonText = await fetch('http://localhost:4321/posts.json')

let posts = await jsonText.json()

let generateAll = true

if (args.length > 0) {
  generateAll = false
  posts = posts.filter((p) => {
    return p.slug === args[0]
  })
}

if (!fs.existsSync('./public/og')) {
  fancyLog('creating og directory')
  fs.mkdirSync('./public/og')
  fancyLog('og directory created')
}

if (generateAll) {
  // clear the og directory
  let files = fs.readdirSync('./public/og')
  for (const file of files) {
    fancyLog(`deleting ${file}`)
    fs.unlinkSync(`./public/og/${file}`)
    fancyLog(`${file} deleted`)
  }
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
    font-family: monospace, Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,serif;
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
  <div style="width: 100%; font-size: {{titleSize}}; line-height: 1.3; margin-top: 1rem">
  {{title}}
  </div>
  <div style="width: 100%; margin-top: 1rem; font-size: .8rem">
  {{tags}}
  </div>
</body>
</html>
`

for (let i = 0; i < posts.length; i++) {
  let post = posts[i]
  await generateOg(post)

  // if(i >= 0){
  //   break
  // }
}

fancyLog(`done in ${Date.now() - start}ms`)

async function generateOg(post) {
  await nodeHtmlToImage({
    html: html,
    type: 'jpeg',
    output: `./public/og/${post.slug}.jpg`,
    quality: 80,
    content: {
      logoUrl: dataURI,
      title: post.title,
      tags: post.tags.join(', '),
      bgDataURI: bgDataURI,
      titleSize: post.title.length > 25 ? '1.2rem' : '1.5rem'
    }
  })
  fancyLog(`generated og for ${post.slug}`)
}
