import useStore from './Store.jsx'
import MarkdownIt from 'markdown-it'
import {createStorage} from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'
import dayjs from 'dayjs'

const [store, setStore] = useStore()

let owner = 'jw-12138'
let repo = 'jw-12138.github.io'
let auth_api = 'https://github.com/login/oauth/authorize'
let client_id = 'Iv1.717c117523f74671'

// indexedDb storage
const storage = createStorage({
  driver: indexedDbDriver({
    base: '',
    dbName: 'blog_idb',
    storeName: 'blog_store'
  })
})


// markdown renderer
const md = MarkdownIt({
  linkify: true
})

/**
 * parse @username to link
 */
let originalTextParser = md.renderer.rules.text
md.renderer.rules.text = function (tokens, idx) {
  let text = tokens[idx].content
  let mentionRegex = /@([a-zA-Z0-9_-]+)/g

  if (mentionRegex.test(text)) {
    text = text.replace(mentionRegex, (match, username) => {
      return `<a href="https://github.com/${username}">@${username}</a>`
    })

    return text
  }

  return originalTextParser(tokens, idx)
}

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

    let cached = await storage.getItem(key)

    if (cached) {
      return cached
    }
  }

  if (containsCodeBlocks(markdown)) {
    try {
      let resp = await githubApi('/markdown', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: markdown,
          mode: 'gfm'
        })
      })

      let remoteText = await resp.text()
      if (id && updated_at) {
        let timestamp = dayjs(updated_at).unix()
        let key = `cache:markdown:comment:${id}:${timestamp}`
        let oldCacheKeys = await storage.getKeys(`cache:markdown:comment:${id}`)
        oldCacheKeys.map(async key => {
          await storage.removeItem(key)
        })
        await storage.setItem(key, remoteText)
      }
      return remoteText
    } catch (e) {
      return md.render(markdown)
    }
  }
  return md.render(markdown)
}

export {
  githubApi,
  renderMarkdown,
  md,
  auth_api,
  client_id,
  owner,
  repo
}
