import {getCollection} from 'astro:content'
import {buildDateStr} from "../utils"

export async function GET() {
  const allPosts = await getCollection('posts')

  let atom = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/feed.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Jacky Wong</title>
  <link href="https://jw1.dev/atom.xml" rel="self"/>
  <link href="https://jw1.dev/" rel="alternate"/>
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
      let date_str = a.id

      let date_array = date_str.split('-')
      let year = date_array[0]
      let month = date_array[1]
      let day = date_array[2]

      date_a = `${year}-${month}-${day}`
    }

    if (!date_b) {
      let date_str = b.id

      let date_array = date_str.split('-')
      let year = date_array[0]
      let month = date_array[1]
      let day = date_array[2]

      date_b = `${year}-${month}-${day}`
    }

    return new Date(date_b).getTime() - new Date(date_a).getTime()
  })

  allPosts.slice(0, 5).map((post, index) => {
    let {date, deprecated, draft} = post.data
    if (deprecated || draft) {
      return false
    }
    if (!date) {
      let date_str = post.id

      let date_array = date_str.split('-')
      let year = date_array[0]
      let month = date_array[1]
      let day = date_array[2]

      date = `${year}-${month}-${day}`
    }

    if(date instanceof Date){
      date = buildDateStr(date)
    }

    let datePath = date.split('-').join('/')
    let postPath = post.id.slice(11)
    let url = `https://jw1.dev/${datePath}/${postPath}.html`

    if(new Date(date).getTime() > new Date('2024-05-30').getTime()){
      url = `https://jw1.dev/${postPath}`
    }

    atom += `

  <entry>
    <title>${post.data.title}</title>
    <id>${url}</id>
    <link href="${url}"/>
    <published>${new Date(date).toISOString()}</published>
    <published_readable>${date}</published_readable>
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
