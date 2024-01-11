import {getCollection} from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt()

export async function GET(context) {
  let allPosts = await getCollection('posts')

  let atom = `<feed xmlns="http://www.w3.org/2005/Atom">
  <title>一个球的博客</title>
  <link href="https://jw1.dev/atom.xml" rel="self"/>
  <link href="https://jw1.dev/"/>
  <updated>${new Date().toISOString()}</updated>
  <id>https://jw1.dev/</id>
  <author>
    <name>Jacky Wong</name>
  </author>
  <generator uri="https://astro.build/">Astro</generator>`

  allPosts.sort((a, b) => {
    let {date: date_a} = a.data
    let {date: date_b} = b.data

    if (!date_a) {
      let date_str = a.slug

      let date_array = date_str.split('-')
      let year = date_array[0]
      let month = date_array[1]
      let day = date_array[2]

      date_a = `${year}-${month}-${day}`
    }

    if (!date_b) {
      let date_str = b.slug

      let date_array = date_str.split('-')
      let year = date_array[0]
      let month = date_array[1]
      let day = date_array[2]

      date_b = `${year}-${month}-${day}`
    }

    return new Date(date_b).getTime() - new Date(date_a).getTime()
  })

  allPosts.map((post, index) => {
    let {date, deprecated, draft} = post.data
    if (deprecated || draft) {
      return false
    }
    if (!date) {
      let date_str = post.slug

      let date_array = date_str.split('-')
      let year = date_array[0]
      let month = date_array[1]
      let day = date_array[2]

      date = `${year}-${month}-${day}`
    }

    let tags = ''

    if (post.data.tags && post.data.tags.length > 0) {
      tags = post.data.tags.map((tag) => {
        return `<category term="${tag}"/>`
      }).join('')
    }

    let datePath = date.split('-').join('/')
    let postPath = post.slug.slice(11)

    atom += `

  <entry>
    <title>${post.data.title}</title>
    <id>https://jw1.dev/${datePath}/${postPath}.html</id>
    <link href="https://jw1.dev/${datePath}/${postPath}.html"/>
    <published>${new Date(date).toISOString()}</published>
    <content type="html">
    <![CDATA[${sanitizeHtml(parser.render(post.body))}]]>
    </content>
    ${tags}
</entry>`
  })

  atom += `

</feed>`

  return new Response(atom, {
    headers: {
      'content-type': 'application/xml;charset=UTF-8'
    }
  })
}
