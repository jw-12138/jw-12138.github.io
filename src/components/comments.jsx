import {onMount} from 'solid-js'
import useStore from './comments/Store.jsx'
import Loading from './comments/Loading.jsx'
import LoginPanel from './comments/LoginPanel.jsx'
import {githubApi} from './comments/utils.jsx'
import InputAndPreview from './comments/InputAndPreview.jsx'
import CommentList from './comments/CommentList.jsx'

const [store, setStore] = useStore()

export default function Comments(props) {
  let commentDom
  setStore('githubIssueId', props.githubIssueId)

  /**
   * check login status
   * @returns {Promise<boolean>}
   */
  async function checkLogin() {
    setStore('accessToken', localStorage.getItem('access_token'))

    if (!store.accessToken) {
      return false
    }

    let resp

    try {
      setStore('gettingUser', true)
      resp = await githubApi('/user')
    } catch (e) {
      console.log(e)
    } finally {
      setStore('gettingUser', false)
    }

    if (!resp.ok) {
      return false
    }

    setStore('user', await resp.json())
    setStore('isUserLoggedIn', true)
  }

  onMount(async () => {
    let params = new URLSearchParams(document.location.search)
    let token = params.get('access_token')
    let type = params.get('token_type')
    if (token && type) {
      localStorage.setItem('access_token', token)
      localStorage.setItem('token_type', type)
      localStorage.setItem('token_timestamp', new Date() + '')
      location.href = location.protocol + '//' + location.host + location.pathname + '#comments'

      return false
    }

    let pageHash = location.hash
    if (pageHash === '#comments') {
      document.getElementById('comments').scrollIntoView({
        behavior: 'instant'
      })

      // replace url without hash
      history.replaceState(null, '', location.href.split('#')[0])
    }

    await checkLogin()
  })

  return <>
    {props.githubIssueId && <div ref={commentDom} data-name="comments" id="comments" class="mb-4">
      <div class="my-8 h-[1px]">
      </div>

      <Loading></Loading>
      <LoginPanel></LoginPanel>
      <InputAndPreview></InputAndPreview>

      {!store.gettingUser && <CommentList></CommentList>}

    </div>}
  </>
}
