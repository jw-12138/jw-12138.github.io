import fs from 'fs'

export default async function (title, options = {}) {
  const pwd = process.cwd()

  const typeExtensionMap = {
    md: '.md',
    mdx: '.mdx'
  }

  let fileType = options.type || 'mdx'

  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  if (month < 10) {
    month = '0' + month
  }

  if (day < 10) {
    day = '0' + day
  }

  // only allow letters, numbers, dashes and underscores
  const originalTitle = title
  const fileTitle = title.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()

  const establishedDir = pwd + `/src/content/posts`
  const establishedFile = `${year}-${month}-${day}-${fileTitle}${typeExtensionMap[fileType]}`
  const establishedPath = `${establishedDir}/${establishedFile}`

  if (!fs.existsSync(establishedDir)) {
    console.log(`the folder [${establishedDir}] does not exist, please create it first.`)
    return
  }

  if (fs.existsSync(establishedPath)) {
    console.log(`file is already there, [${establishedPath}]`)
    return
  }

  let isDraft = options.draft || false
  let draftFrontMatter = ''

  if (isDraft) {
    draftFrontMatter = '\ndraft: true'
  }

  const template = `---
title: ${originalTitle}${draftFrontMatter}
date: ${new Date().toISOString()}
---

`

  console.log(`applying template to [${establishedFile}]...`)
  console.log(template)
  fs.writeFileSync(establishedPath, template)
  console.log('Post created.')
}
