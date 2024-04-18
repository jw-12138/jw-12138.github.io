import useStore from './Store.jsx'
import {githubApi, md, owner, renderMarkdown, repo} from './utils.jsx'
import {createEffect, createSignal, on} from 'solid-js'

const [store, setStore] = useStore()

function inputAndPreview() {

  let [showPreview, setShowPreview] = createSignal(false)
  let [userCommentHTML, setUserCommentHTML] = createSignal('')

  createEffect(on(() => store.userComment, async val => {
    if (!val) {
      return
    }

    let markdown = md.render(val)

    setUserCommentHTML(markdown)
  }))

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

  return <>
    {store.isUserLoggedIn && <section data-name="textarea" class="pt-8">

      <form action="javascript:"
            onsubmit={sendComment}>
        <div className="flex mb-2">

          <button type="button"
                  onclick={() => setShowPreview(false)}
                  className="rounded-full text-sm px-4 py-2 flex items-center group transition-all"
                  classList={{
                    'dark:bg-white dark:text-black bg-neutral-800 text-white': !showPreview(),
                    'dark:bg-white/10 dark:text-white bg-black/5 text-black': showPreview()
                  }}>
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="icon icon-tabler icon-tabler-markdown w-5 h-5 mr-1 top-0 relative transition-all"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/>
              <path d="M7 15v-6l2 2l2 -2v6"/>
              <path d="M14 13l2 2l2 -2m-2 2v-6"/>
            </svg>
            书写
          </button>


          <button
            type="button"
            onclick={() => setShowPreview(true)}
            className="rounded-full text-sm px-4 py-2 ml-2 flex items-center group"
            classList={{
              'dark:bg-white dark:text-black bg-neutral-800 text-white': showPreview(),
              'dark:bg-white/10 dark:text-white bg-black/5 text-black': !showPreview()
            }}>
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="icon icon-tabler icon-tabler-eye-code w-5 h-5 mr-1 top-0 relative transition-all"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>
              <path
                d="M11.11 17.958c-3.209 -.307 -5.91 -2.293 -8.11 -5.958c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6c-.21 .352 -.427 .688 -.647 1.008"/>
              <path d="M20 21l2 -2l-2 -2"/>
              <path d="M17 17l-2 2l2 2"/>
            </svg>
            预览
          </button>
        </div>

        {
          showPreview() &&
          <div
            className="rounded-2xl block px-4 py-4 border-none focus:shadow-2xl dark:bg-neutral-800 bg-zinc-100 w-full resize-y min-h-[6rem] text-sm page-content comment-content"
            innerHTML={store.userComment ? userCommentHTML() : '先写点什么吧'}
          >

          </div>
        }

        {!showPreview() &&
          <textarea
            id="comment_textarea"
            className="rounded-2xl block px-4 py-4 font-mono border-none focus:shadow-2xl dark:bg-neutral-800 bg-zinc-100 w-full resize-y min-h-[6rem] text-sm rounded-br-[6px]"
            required
            name="comment"
            placeholder="提些问题，或者打个招呼吧"
            value={store.userComment}
            oninput={(e) => setStore('userComment', e.target.value)}
          ></textarea>
        }

        <div className="pt-2 text-xs dark:text-neutral-400 text-neutral-500 leading-5 ">
          评论系统基于
          <a
            target="_blank"
            className="text-black font-extrabold dark:text-white"
            href="https://github.com/features/issues">
            GitHub Issues
          </a>
          制作，发言请记得遵守
          <a
            target="_blank"
            className="text-black dark:text-white font-extrabold"
            href="https://docs.github.com/zh/site-policy/github-terms/github-community-code-of-conduct">
            GitHub 社区行为准则
          </a>
          。如果您比较好奇本博客是如何处理数据的，可以查看
          <a
            href="/privacy"
            className="text-black dark:text-white font-extrabold">
            隐私声明
          </a>。
        </div>

        <div className="text-center mt-2 flex justify-center" classList={{
          hidden: store.gettingUser
        }}>
          <button type="submit"
                  classList={{
                    'hidden': store.sending_comment
                  }}
                  className="rounded-full px-4 py-2 bg-neutral-800 text-white dark:bg-white dark:text-black text-sm flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="icon icon-tabler icon-tabler-send w-4 h-4 mr-2 top-0 relative transition-all"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 14l11 -11"/>
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/>
            </svg>
            发送评论
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

    </section>}
  </>
}

export default inputAndPreview
