const fs = require('fs')
const Feed = require('feed').Feed
const absolution = require('absolution')
const abs_url = 'https://jw1.dev'

const __ASSET = 'assets/'

const feed = new Feed({
  title: "Jacky's Blog",
  description: 'FRONT-END DEVELOPER / MUSIC PRODUCER',
  id: 'https://jw1.dev/',
  link: 'https://jw1.dev/',
  language: 'zh-CN',
  image: 'https://jw1.dev/favicon.png',
  favicon: 'https://jw1.dev/favicon.png',
  copyright: 'Copyright © 2018 - 2020 Jacky Wong. All rights reserved',
  feedLinks: {
    atom: 'https://jw1.dev/atom.xml'
  },
  author: {
    name: 'Jacky Wong',
    email: 'jw_12138@outlook.com',
    link: 'https://github.com/jw-12138'
  }
})

let data = fs.readFileSync(__ASSET + 'data.json')
data = JSON.parse(data)

let posts = data.articles
let pages = data.pages

posts.forEach((post) => {
  let content_url = post.hash_url.replace('-', '/')
  let content = fs.readFileSync(__ASSET + 'posts/' + content_url)
  content = content.toString()
  content = absolution(content, abs_url)
  let date_arr = post.date.split('-')
  let date = new Date(date_arr[0], date_arr[1], date_arr[2])
  feed.addItem({
    title: post.name,
    id: 'https://jw1.dev/#/post/' + post.hash_url,
    link: 'https://jw1.dev/#/post/' + post.hash_url,
    description: post.summary + '...',
    content: content,
    author: [
      {
        name: 'Jacky Wong',
        email: 'jw_12138@outlook.com',
        link: 'https://github.com/jw-12138'
      }
    ],
    date: date
  })
})

pages.forEach((page) => {
  let content = fs.readFileSync(__ASSET + page.hash_url)
  content = content.toString()
  content = absolution(content, abs_url)
  let date_arr = page.date.split('-')
  let date = new Date(date_arr[0], date_arr[1], date_arr[2])
  feed.addItem({
    title: page.name,
    id: 'https://jw1.dev/#/page/' + page.hash_url,
    link: 'https://jw1.dev/#/page/' + page.hash_url,
    content: content,
    author: [
      {
        name: 'Jacky Wong',
        email: 'jw_12138@outlook.com',
        link: 'https://github.com/jw-12138'
      }
    ],
    date: date
  })
})

feed.addCategory(['Coding', 'Front-end development', 'Music Production'])

fs.writeFile('./atom.xml', feed.atom1(), {}, function () {})
