import {getCollection} from 'astro:content'
import {buildDateStr} from "../utils"

export async function GET() {
  let allPosts = await getCollection('posts')

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

  let outputJson = allPosts.map((p) => {
    let {date} = p.data

    if (!date) {
      let date_str = p.id

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
    let postPath = p.id.slice(11)

    let url = `jw1.dev/${datePath}/${postPath}`

    if(new Date(date).getTime() > new Date('2024-05-30').getTime()){
      url = `jw1.dev/${postPath}`
    }

    return {
      url: url,
      title: p.data.title,
      tags: p.data.tags,
      slug: p.id,
      deprecated: p.data.deprecated || false
    }
  })

  return new Response(JSON.stringify(outputJson), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
