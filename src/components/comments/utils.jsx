import useStore from './Store.jsx'
import dayjs from 'dayjs'

const [store, setStore] = useStore()

let owner = 'jw-12138'
let repo = 'jw-12138.github.io'
let auth_api = 'https://github.com/login/oauth/authorize'
let client_id = 'Iv1.717c117523f74671'

/**
 * GitHub api helper
 * @param {string} endpoint
 * @param {object} init
 * @returns {Promise<Response>}
 */
async function githubApi(endpoint, init = {}) {
  let headers = {
    'Accept': 'application/vnd.github+json',
    ...init.headers
  }

  if ((localStorage.getItem('access_token') && store.isUserLoggedIn) || endpoint === '/user') {
    headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
  }

  let _init = {
    method: init.method || 'GET',
    headers
  }

  if (init.body) {
    _init.body = init.body
  }

  // disable workers cache
  endpoint = endpoint + '?' + new URLSearchParams({
    t: Date.now()
  })

  return await fetch(store.proxy + endpoint, _init)
}

/**
 * check if markdown contains any code fence
 * @param {string} markdown
 * @returns {boolean}
 */
function containsCodeBlocks(markdown) {
  const codeBlockPattern = /```(.*?)```/gs
  return codeBlockPattern.test(markdown)
}

/**
 * render markdown to html
 * @param markdown
 * @param {?number} id
 * @param {?string} updated_at
 * @returns {Promise<string>}
 */
async function renderMarkdown(markdown, id = -1, updated_at = '') {
  if (id && updated_at) {
    let timestamp = dayjs(updated_at).unix()
    let key = `cache:markdown:comment:${id}:${timestamp}`

    let cached = sessionStorage.getItem(key)

    if (cached) {
      return cached
    }
  }

  try {
    let resp = await fetch('https://md.jw1.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: markdown
    })

    let remoteText = await resp.text()

    if (id && updated_at) {
      let timestamp = dayjs(updated_at).unix()
      let key = `cache:markdown:comment:${id}:${timestamp}`
      let oldCacheKeys = sessionStorage.getItem(`cache:markdown:comment:${id}`)

      oldCacheKeys = oldCacheKeys ? JSON.parse(oldCacheKeys) : []

      oldCacheKeys.map(async key => {
        sessionStorage.removeItem(key)
      })
      sessionStorage.setItem(key, remoteText)
    }
    return remoteText
  } catch (e) {
    console.log(e)
    return '<p>Failed to render markdown</p>'
  }
}

export {
  githubApi,
  renderMarkdown,
  auth_api,
  client_id,
  owner,
  repo
}
