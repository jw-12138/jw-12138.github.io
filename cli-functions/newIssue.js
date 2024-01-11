import 'dotenv/config'

export default async function (title, path) {
  let github_token = process.env.GITHUB_TOKEN
  let owner = 'jw-12138'
  let repo = 'jw-12138.github.io'
  let host = 'https://api.github.com'
  let endpoint = `${host}/repos/${owner}/${repo}/issues`

  let body = {
    title: title + ' - 一个球的博客',
    body: `This issue was generated for blog post [${title} - 一个球的博客](https://jw1.dev${path})`,
    labels: ['Comment']
  }

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${github_token}`
    },
    body: JSON.stringify(body)
  }).then(res => {
    return res.json()
  }).then(json => {
    console.log(`New issue created: ${json.title}`)
    console.log('Issue Number: ' + json.number)
    console.log('Issue URL: ' + json.html_url)
  }).catch(err => {
    console.error('Error:')
    console.log(err)
  })
}
