import fs from 'fs'
import moment from 'moment-timezone'
import Hexo from 'hexo'
let hexo = new Hexo(process.cwd(), {
  safe: true,
  silent: true
})

console.log('Generating README.md...')

let baseUrl

hexo.init().then(function () {
  return hexo.load()
}).then(() => {
  baseUrl = hexo.config.url
  let posts = hexo.locals.get('posts')
  let data = hexo.locals.get('data')

  posts = posts.data

  posts.forEach(el => {
    return el.timeStamp = moment(el.date).unix()
  })

  posts = posts.sort((a, b) => {
    return b.timeStamp - a.timeStamp
  })

  gen(posts, data)
})

function gen(posts, siteData) {

  let str = `
# 🙌[jw1.dev](https://jw1.dev) 🙌

## Posts

`

  let post_list_str = ''
  let friend_list_str = ''

  console.log('\n# POSTS:')

  posts.forEach(el => {
    console.log(moment(el.date).format('YYYY-MM-DD'), el.title)
    post_list_str += `- [${el.title}](${baseUrl + '/' + el.path}) - ${moment(el.date).format('YYYY-MM-DD')} \n`
  })

  str += post_list_str

  str += `
## Friends

`
  console.log('\n# FRIENDS:')
  let links = siteData.data.links
  links.forEach(el => {
    friend_list_str += `- [${el.name}](${el.url}) - ${el.slogan}  \n`
    console.log(el.name)
  })

  str += friend_list_str

  fs.writeFile('README.md', str, function (err) {
    if (err) {
      console.log('\nGenerating [README.md] has Failed!\n')
      throw err
    }

    console.log('\nSuccessfully Generated [README.md]\n')
  })
}
