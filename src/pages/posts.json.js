import {getCollection} from 'astro:content'

export async function GET(context) {
  let allPosts = await getCollection('posts')

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

  let outputJson = allPosts.map((p) => {
    let {date} = p.data

    if (!date) {
      let date_str = p.slug

      let date_array = date_str.split('-')
      let year = date_array[0]
      let month = date_array[1]
      let day = date_array[2]

      date = `${year}-${month}-${day}`
    }

    let datePath = date.split('-').join('/')
    let postPath = p.slug.slice(11)

    let url = `https://jw1.dev/${datePath}/${postPath}.html`

    return {
      url: url,
      title: p.data.title,
      tags: p.data.tags,
      slug: p.slug,
      deprecated: p.data.deprecated || false
    }
  })

  return new Response(JSON.stringify(outputJson), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
