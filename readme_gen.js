const fs = require('fs')
const moment = require('moment')
var Hexo = require('hexo');
var hexo = new Hexo(process.cwd(), {
  safe: true,
  silent: true
})

console.log('Generating README.md...')

let baseUrl

hexo.init().then(function(){
  return hexo.load()
}).then(() => {
  baseUrl = hexo.config.url
  let posts = hexo.locals.get('posts')
  let data = hexo.locals.get('data')
  gen(posts.data, data)
})

function gen(posts, siteData){
  
  let str = `
# 🙌[jw1.dev](https://jw1.dev) 🙌

## Posts

`
  
  let post_list_str = ''
  let friend_list_str = ''
  
  for (let i = posts.length - 1; i >= 0; i--) {
    let el = posts[i]
    post_list_str += `- [${el.title}](${baseUrl + '/' + el.path}) - ${moment(el.date).format('YYYY-MM-DD')} \n`;
  }
  
  str += post_list_str
  
  str += `
## Friends

`
  let links = siteData.data.links
  links.forEach(el => {
    friend_list_str += `- [${el.name}](${el.url}) - ${el.slogan}  \n`;
  })
  
  str += friend_list_str
  
  fs.writeFile('README.md', str, function (err) {
    if(err){
      console.log('\n\n  Generating [README.md] has Failed!\n\n')
      throw err
    }
  
    console.log('\n\nSuccessfully Generated [README.md]\n\n')
  })
}