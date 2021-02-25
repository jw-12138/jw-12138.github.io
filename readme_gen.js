const fs = require('fs');

let data = fs.readFileSync('./assets/data.json');
data = JSON.parse(data)

let output = ''

let head = `### [一个球](https://jw1.dev)  \n\n`
let rss_link = `[RSS订阅 🚩](https://jw1.dev/atom.xml)  \n\n`
let post_head = '#### 最近的文章  \n\n'

let link_head = '#### 友情链接  \n\n'

let posts = data.articles
let links = data.links

output += head
output += rss_link
output += post_head

posts.forEach(post => {
    output += `- [${post.name}](https://jw1.dev/#/post/${post.hash_url})  \n  > ${post.summary}...  \n\n`
});

output += link_head

links.forEach(link => {
    output += `- [${link.name}](${link.url})  \n  > ${link.slogan}  \n\n`
});

fs.writeFile('./README.md', output, {}, function () {

})