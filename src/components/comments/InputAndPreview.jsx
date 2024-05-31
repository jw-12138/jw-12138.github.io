import useStore from './Store.jsx'
import {githubApi, owner, renderMarkdown, repo} from './utils.jsx'

const [store, setStore] = useStore()

function inputAndPreview() {

  async function sendComment() {
    if (store.sending_comment) {
      return false
    }

    setStore('sending_comment', true)

    let resp

    try {
      resp = await githubApi(`/repos/${owner}/${repo}/issues/${store.githubIssueId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          body: store.userComment
        })
      })
    } catch (e) {
      console.log(e)
      alert('发送评论失败，请稍后再试')
    } finally {
      setStore('sending_comment', false)
    }

    if (!resp.ok) {
      alert('发送评论失败，请稍后再试')
      return
    }

    let json = await resp.json()

    json.bodyHTML = await renderMarkdown(json.body, json.id, json.updated_at)
    setStore('comments', [...store.comments, json])
    setStore('userComment', '')

    setTimeout(function () {
      document.getElementById(json.id).scrollIntoView({
        behavior: 'smooth'
      })
    }, 300)
  }

  let textareaPlaceHolder = function () {
    if (store.gettingUser) {
      return 'Loading...'
    }

    if (!store.isUserLoggedIn) {
      return 'Please log in first'
    }

    return "Ask a question or leave a comment"
  }

  return <>
    <section data-name="textarea" className="pt-8">

      <form action="javascript:"
            onSubmit={sendComment}>

        <textarea
          disabled={store.gettingUser || !store.isUserLoggedIn}
          id="comment_textarea"
          className="rounded-2xl block px-4 py-4 font-mono border-none focus:shadow-2xl dark:bg-neutral-800 bg-zinc-100 w-full resize-y min-h-[6rem] text-sm rounded-br-[6px]"
          required
          name="comment"
          placeholder={textareaPlaceHolder()}
          value={store.userComment}
          onInput={(e) => setStore('userComment', e.target.value)}
        ></textarea>

        <div className="pt-2 text-xs dark:text-neutral-400 text-neutral-500 leading-5 ">
          The comment system is made with <a
          target="_blank"
          className="text-black font-extrabold dark:text-white"
          href="https://github.com/features/issues">
          GitHub Issues
        </a>, please follow the <a
          target="_blank"
          className="text-black dark:text-white font-extrabold"
          href="https://docs.github.com/en/site-policy/github-terms/github-community-code-of-conduct">
          GitHub Community Code of Conduct
        </a>. If you are curious about how we process your data, please refer to our <a
          href="/privacy"
          className="text-black dark:text-white font-extrabold">
          privacy policy
        </a>.
        </div>

        <div className="text-center mt-8 flex justify-center" classList={{
          hidden: store.gettingUser
        }}>
          <button type="submit"
                  disabled={!store.isUserLoggedIn}
                  classList={{
                    'hidden': store.sending_comment,
                    'opacity-50': !store.isUserLoggedIn
                  }}
                  className="rounded-full px-4 py-2 bg-neutral-800 text-white dark:bg-white dark:text-black text-sm flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send mr-2 w-4 h-4">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 14l11 -11"/>
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/>
            </svg>
            Send
          </button>
          <button disabled
                  classList={{
                    'hidden': !store.sending_comment
                  }}
                  className="rounded-full disabled:opacity-70 px-4 py-2 bg-neutral-800 text-white dark:bg-white dark:text-black text-sm flex items-center whitespace-nowrap"
                  type="button">
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="icon icon-tabler icon-tabler-loader-2 animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
            发送评论
          </button>
        </div>

      </form>

    </section>
  </>
}

export default inputAndPreview
